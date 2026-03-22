package com.eventzen.bookingservice.service;

import com.eventzen.bookingservice.dto.AttendeeDTO;
import com.eventzen.bookingservice.dto.BookingDetailResponse;
import com.eventzen.bookingservice.dto.BookingSummaryResponse;
import com.eventzen.bookingservice.dto.CreateBookingRequest;
import com.eventzen.bookingservice.dto.EventDTO;
import com.eventzen.bookingservice.dto.EventStatsResponse;
import com.eventzen.bookingservice.dto.UpdateBookingRequest;
import com.eventzen.bookingservice.entity.Attendee;
import com.eventzen.bookingservice.entity.Booking;
import com.eventzen.bookingservice.entity.BookingStatus;
import com.eventzen.bookingservice.entity.Payment;
import com.eventzen.bookingservice.exception.BadRequestException;
import com.eventzen.bookingservice.exception.ForbiddenOperationException;
import com.eventzen.bookingservice.exception.ResourceNotFoundException;
import com.eventzen.bookingservice.repository.BookingRepository;
import com.eventzen.bookingservice.repository.PaymentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final PaymentRepository paymentRepository;

    public BookingService(BookingRepository bookingRepository,
                          EventServiceClient eventServiceClient,
                          PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.eventServiceClient = eventServiceClient;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Booking createBooking(CreateBookingRequest request, Long userId, String authorizationHeader) {
        validateAttendeeList(request.getAttendees());
        int newAttendeeCount = request.getAttendees().size();

        EventDTO event = eventServiceClient.getEvent(request.getEventId(), authorizationHeader);

        if (event.getStartTime() != null && !LocalDateTime.now().isBefore(event.getStartTime())) {
            throw new BadRequestException("Cannot create booking after event start time");
        }

        // Only enforce per-user attendee limit if set and positive
        if (event.getMaxAttendeesPerUser() != null && event.getMaxAttendeesPerUser() > 0) {
            int existingUserAttendees = bookingRepository.getTotalAttendeesByUser(
                    userId,
                    request.getEventId(),
                    BookingStatus.CANCELLED
            );
            if (existingUserAttendees + newAttendeeCount > event.getMaxAttendeesPerUser()) {
                throw new BadRequestException("Per-user attendee limit exceeded");
            }
        }

        if (event.getCapacity() == null || event.getCapacity() <= 0) {
            throw new BadRequestException("Invalid event capacity configured");
        }

        int alreadyBookedForEvent = bookingRepository.getTotalAttendeesForEvent(
                request.getEventId(),
                BookingStatus.APPROVED
        );
        if (alreadyBookedForEvent + newAttendeeCount > event.getCapacity()) {
            throw new BadRequestException("Event capacity exceeded");
        }

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setEventId(request.getEventId());
        booking.setAttendeeCount(newAttendeeCount);
        booking.setBookingStatus(BookingStatus.PENDING); // PENDING by default
        booking.setBookingDate(LocalDateTime.now());
        booking.setCreatedBy(userId);
        booking.setUpdatedBy(userId);
        booking.setStatus(1);

        for (AttendeeDTO attendeeDTO : request.getAttendees()) {
            Attendee attendee = new Attendee();
            attendee.setName(attendeeDTO.getName().trim());
            attendee.setEmail(attendeeDTO.getEmail().trim().toLowerCase());
            attendee.setPhone(attendeeDTO.getPhone().trim());
            attendee.setCreatedBy(userId);
            attendee.setUpdatedBy(userId);
            attendee.setStatus(1);
            booking.addAttendee(attendee);
        }

        Booking saved = bookingRepository.save(booking);

        // Auto-create mock payment (as if user paid immediately)
        createMockPayment(saved, event, userId);

        return saved;
    }

    private void createMockPayment(Booking booking, EventDTO event, Long userId) {
        BigDecimal ticketPrice = event.getCostPerTicket() != null
                ? event.getCostPerTicket()
                : BigDecimal.ZERO;
        BigDecimal totalAmount = ticketPrice.multiply(BigDecimal.valueOf(booking.getAttendeeCount()));

        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(Payment.PaymentMethod.CASH);
        payment.setPaymentStatus(Payment.PaymentStatus.SUCCESS);
        payment.setTransactionReference("MOCK-" + booking.getId());
        payment.setCreatedBy(userId);
        payment.setUpdatedBy(userId);
        payment.setStatus(1);
        paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public List<BookingSummaryResponse> getMyBookings(Long userId) {
        return bookingRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, 1)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<BookingSummaryResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findByStatus(1, pageable)
                .map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public List<AttendeeDTO> getAttendeesForEvent(Long eventId) {
        List<Booking> approvedBookings = bookingRepository.findByEventIdAndBookingStatusAndStatus(eventId, BookingStatus.APPROVED, 1);
        return approvedBookings.stream()
                .flatMap(b -> b.getAttendees().stream())
                .map(a -> {
                    AttendeeDTO dto = new AttendeeDTO();
                    dto.setName(a.getName());
                    dto.setEmail(a.getEmail());
                    dto.setPhone(a.getPhone());
                    return dto;
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public EventStatsResponse getEventStats(Long eventId, String authorizationHeader) {
        EventDTO event = eventServiceClient.getEvent(eventId, authorizationHeader);
        if (event.getCapacity() == null || event.getCapacity() < 0) {
            throw new BadRequestException("Invalid event capacity configured");
        }

        int totalBooked = bookingRepository.getTotalAttendeesForEvent(eventId, BookingStatus.APPROVED);
        int remainingCapacity = Math.max(event.getCapacity() - totalBooked, 0);

        return new EventStatsResponse(totalBooked, remainingCapacity);
    }

    @Transactional(readOnly = true)
    public BookingDetailResponse getBookingDetails(Long bookingId, Long currentUserId, boolean admin) {
        Booking booking = bookingRepository.findByIdAndStatus(bookingId, 1)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!admin && !booking.getUserId().equals(currentUserId)) {
            throw new ForbiddenOperationException("You are not allowed to view this booking");
        }

        return toDetailResponse(booking);
    }

    /**
     * Handles both update and cancel via a single PUT endpoint.
     * If request.bookingStatus == CANCELLED → cancel the booking.
     * Otherwise → update attendees (with capacity check).
     */
    @Transactional
    public Booking updateBooking(Long bookingId, UpdateBookingRequest request, Long userId, boolean admin, String authorizationHeader) {
        Booking booking = bookingRepository.findByIdAndStatus(bookingId, 1)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!admin && !booking.getUserId().equals(userId)) {
            throw new ForbiddenOperationException("You are not allowed to update this booking");
        }

        // 1. Process Status Change First
        if (request.getBookingStatus() != null && booking.getBookingStatus() != request.getBookingStatus()) {
            if (request.getBookingStatus() == BookingStatus.APPROVED && !admin) {
                throw new BadRequestException("Only admin can approve bookings");
            }
            booking.setBookingStatus(request.getBookingStatus());
            booking.setUpdatedBy(userId);
        }

        // 2. Process Attendees Update if provided
        if (request.getAttendees() != null && !request.getAttendees().isEmpty()) {
            validateAttendeeList(request.getAttendees());
            int newAttendeeCount = request.getAttendees().size();

            booking.setAttendeeCount(newAttendeeCount);
            booking.setUpdatedBy(userId);
            
            booking.getAttendees().clear();
            for (AttendeeDTO attendeeDTO : request.getAttendees()) {
                Attendee attendee = new Attendee();
                attendee.setName(attendeeDTO.getName().trim());
                attendee.setEmail(attendeeDTO.getEmail().trim().toLowerCase());
                attendee.setPhone(attendeeDTO.getPhone().trim());
                attendee.setCreatedBy(userId);
                attendee.setUpdatedBy(userId);
                attendee.setStatus(1);
                booking.addAttendee(attendee);
            }
        }

        // 3. Post-Condition: If the booking ends up as APPROVED, we must verify capacity constraint
        if (booking.getBookingStatus() == BookingStatus.APPROVED) {
            EventDTO event = eventServiceClient.getEvent(booking.getEventId(), authorizationHeader);
            if (event.getCapacity() == null || event.getCapacity() <= 0) {
                throw new BadRequestException("Invalid event capacity configured");
            }
            
            // Re-calculate the current sum in DB WITHOUT this booking's previously saved size
            // However, our in-memory changes are not flushed yet, so totalApprovedInDb reflects the OLD state.
            // Wait, spring data JPA might flush on that SELECT or not depending on flush mode.
            // Better to just calculate safely:
            bookingRepository.flush(); // Force flush the new state to DB
            int newlyFlushedTotal = bookingRepository.getTotalAttendeesForEvent(booking.getEventId(), BookingStatus.APPROVED);
            
            if (newlyFlushedTotal > event.getCapacity()) {
                throw new BadRequestException("Event capacity exceeded");
            }
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public void softDeleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findByIdAndStatus(bookingId, 1)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(0); // Soft delete
        bookingRepository.save(booking);
    }

    private void validateAttendeeList(List<AttendeeDTO> attendees) {
        if (attendees == null || attendees.isEmpty()) {
            throw new BadRequestException("At least one attendee is required");
        }

        Set<String> dedupe = new HashSet<>();
        for (AttendeeDTO attendee : attendees) {
            if (attendee.getEmail() == null) {
                continue;
            }
            String normalizedEmail = attendee.getEmail().trim().toLowerCase();
            if (!dedupe.add(normalizedEmail)) {
                throw new BadRequestException("Duplicate attendee email is not allowed in the same booking");
            }
        }
    }

    private BookingSummaryResponse toSummaryResponse(Booking booking) {
        BookingSummaryResponse response = new BookingSummaryResponse();
        response.setBookingId(booking.getId());
        response.setEventId(booking.getEventId());
        response.setAttendeeCount(booking.getAttendeeCount());
        response.setBookingStatus(booking.getBookingStatus());
        response.setBookingDate(booking.getBookingDate());
        return response;
    }

    public BookingDetailResponse toDetailResponse(Booking booking) {
        BookingDetailResponse response = new BookingDetailResponse();
        response.setBookingId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setEventId(booking.getEventId());
        response.setAttendeeCount(booking.getAttendeeCount());
        response.setBookingStatus(booking.getBookingStatus());
        response.setBookingDate(booking.getBookingDate());
        response.setAttendees(
                booking.getAttendees().stream().map(attendee -> {
                    AttendeeDTO attendeeDTO = new AttendeeDTO();
                    attendeeDTO.setName(attendee.getName());
                    attendeeDTO.setEmail(attendee.getEmail());
                    attendeeDTO.setPhone(attendee.getPhone());
                    return attendeeDTO;
                }).toList()
        );
        return response;
    }
}
