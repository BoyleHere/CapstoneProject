package com.eventzen.bookingservice.controller;

import com.eventzen.bookingservice.dto.BookingDetailResponse;
import com.eventzen.bookingservice.dto.BookingSummaryResponse;
import com.eventzen.bookingservice.dto.CreateBookingRequest;
import com.eventzen.bookingservice.dto.CreateBookingResponse;
import com.eventzen.bookingservice.dto.EventStatsResponse;
import com.eventzen.bookingservice.dto.UpdateBookingRequest;
import com.eventzen.bookingservice.entity.Booking;
import com.eventzen.bookingservice.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.eventzen.bookingservice.dto.AttendeeDTO;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<CreateBookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            HttpServletRequest httpServletRequest,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        String authorizationHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        Booking booking = bookingService.createBooking(request, userId, authorizationHeader);
        return ResponseEntity.ok(new CreateBookingResponse(booking.getId(), booking.getBookingStatus()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<BookingSummaryResponse>> getMyBookings(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<BookingDetailResponse> getBookingDetails(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        boolean admin = hasRole(authentication, "ROLE_ADMIN");
        return ResponseEntity.ok(bookingService.getBookingDetails(bookingId, userId, admin));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BookingSummaryResponse>> getAllBookings(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @GetMapping("/event/{eventId}/attendees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendeeDTO>> getAttendeesForEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(bookingService.getAttendeesForEvent(eventId));
    }

    @GetMapping("/event/{eventId}/stats")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<EventStatsResponse> getEventStats(
            @PathVariable Long eventId,
            HttpServletRequest httpServletRequest
    ) {
        String authorizationHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        return ResponseEntity.ok(bookingService.getEventStats(eventId, authorizationHeader));
    }


    @PutMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<BookingDetailResponse> updateBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody UpdateBookingRequest request,
            HttpServletRequest httpServletRequest,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        boolean admin = hasRole(authentication, "ROLE_ADMIN");
        String authorizationHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        Booking updated = bookingService.updateBooking(bookingId, request, userId, admin, authorizationHeader);
        return ResponseEntity.ok(bookingService.toDetailResponse(updated));
    }

    @DeleteMapping("/admin/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long bookingId) {
        bookingService.softDeleteBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role::equals);
    }
}
