package com.eventzen.eventservice.service;

import com.eventzen.eventservice.dto.EventRequest;
import com.eventzen.eventservice.dto.EventResponse;
import com.eventzen.eventservice.exception.BadRequestException;
import com.eventzen.eventservice.exception.ConflictException;
import com.eventzen.eventservice.exception.NotFoundException;
import com.eventzen.eventservice.model.Event;
import com.eventzen.eventservice.repository.EventRepository;
import com.eventzen.eventservice.repository.VenueRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    private static final byte ACTIVE = 1;
    private static final byte DELETED = 0;
    private static final int ACTIVE_VENUE = 1;

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    public EventServiceImpl(EventRepository eventRepository, VenueRepository venueRepository) {
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
    }

    @Override
    public EventResponse createEvent(EventRequest request, Long actorUserId) {
        ensureVenueExists(request.getVenueId());
        ensureNoVenueConflictForCreate(request);

        Event event = new Event();
        event.setName(request.getName());
        event.setVenueId(request.getVenueId());
        event.setEventDate(request.getEventDate());
        event.setMaxAttendeesPerUser(normalizeMaxAttendeesPerUser(request.getMaxAttendeesPerUser()));
        event.setBudget(request.getBudget());
        event.setCostPerTicket(request.getCostPerTicket());
        event.setDescription(request.getDescription());
        event.setCreatedBy(actorUserId);
        event.setUpdatedBy(actorUserId);
        event.setStatus(ACTIVE);

        return toResponse(saveWithConflictTranslation(event), true);
    }

    @Override
    public List<EventResponse> getActiveEvents(Long venueId, LocalDateTime fromDate, LocalDateTime toDate) {
        validateDateRange(fromDate, toDate);

        List<Event> events = eventRepository.findActiveEventsWithFilters(ACTIVE, venueId, fromDate, toDate);
        if (events.isEmpty()) {
            return List.of();
        }

        java.util.Set<Long> venueIds = events.stream()
                .map(Event::getVenueId)
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());

        java.util.Map<Long, com.eventzen.eventservice.model.Venue> venueMap = venueRepository.findAllById(venueIds)
                .stream()
                .collect(java.util.stream.Collectors.toMap(com.eventzen.eventservice.model.Venue::getId, v -> v));

        return events.stream()
                .map(event -> {
                    EventResponse response = toResponse(event, false);
                    if (event.getVenueId() != null) {
                        com.eventzen.eventservice.model.Venue venue = venueMap.get(event.getVenueId());
                        if (venue != null) {
                            response.setCapacity(venue.getCapacity());
                        }
                    }
                    return response;
                })
                .toList();
    }

    @Override
    public EventResponse getActiveEventById(Long id) {
        Event event = eventRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Event not found"));
        return toResponse(event, true);
    }

    @Override
    public EventResponse updateEvent(Long id, EventRequest request, Long actorUserId) {
        Event event = eventRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        ensureVenueExists(request.getVenueId());
        ensureNoVenueConflictForUpdate(id, request);

        event.setName(request.getName());
        event.setVenueId(request.getVenueId());
        event.setEventDate(request.getEventDate());
        event.setMaxAttendeesPerUser(normalizeMaxAttendeesPerUser(request.getMaxAttendeesPerUser()));
        event.setBudget(request.getBudget());
        event.setCostPerTicket(request.getCostPerTicket());
        event.setDescription(request.getDescription());
        event.setUpdatedBy(actorUserId);

        return toResponse(saveWithConflictTranslation(event), true);
    }

    @Override
    public void softDeleteEvent(Long id, Long actorUserId) {
        Event event = eventRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        event.setStatus(DELETED);
        event.setUpdatedBy(actorUserId);
        eventRepository.save(event);
    }

    private void ensureNoVenueConflictForCreate(EventRequest request) {
        boolean conflict = eventRepository.existsByVenueIdAndEventDateAndStatus(
                request.getVenueId(), request.getEventDate(), ACTIVE);
        if (conflict) {
            throw new ConflictException("Venue already booked for this time");
        }
    }

    private void ensureNoVenueConflictForUpdate(Long id, EventRequest request) {
        boolean conflict = eventRepository.existsByVenueIdAndEventDateAndStatusAndIdNot(
                request.getVenueId(), request.getEventDate(), ACTIVE, id);
        if (conflict) {
            throw new ConflictException("Venue already booked for this time");
        }
    }

    private Event saveWithConflictTranslation(Event event) {
        try {
            return eventRepository.save(event);
        } catch (DataIntegrityViolationException ex) {
            String message = ex.getMostSpecificCause() != null
                    ? ex.getMostSpecificCause().getMessage()
                    : ex.getMessage();
            String lower = message != null ? message.toLowerCase() : "";
            if (lower.contains("venue already booked for this time")) {
                throw new ConflictException("Venue already booked for this time");
            }
            if (lower.contains("foreign key") && lower.contains("venue")) {
                throw new BadRequestException("Invalid venue ID");
            }
            throw ex;
        }
    }

    private void ensureVenueExists(Long venueId) {
        boolean exists = venueRepository.findByIdAndStatus(venueId, ACTIVE_VENUE).isPresent();
        if (!exists) {
            throw new BadRequestException("Invalid venue ID");
        }
    }

    private Integer normalizeMaxAttendeesPerUser(Integer maxAttendeesPerUser) {
        if (maxAttendeesPerUser == null || maxAttendeesPerUser == 0) {
            return null;
        }
        if (maxAttendeesPerUser < 0) {
            throw new BadRequestException("maxAttendeesPerUser cannot be negative");
        }
        return maxAttendeesPerUser;
    }

    private void validateDateRange(LocalDateTime fromDate, LocalDateTime toDate) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new BadRequestException("fromDate cannot be after toDate");
        }
    }

    private EventResponse toResponse(Event event, boolean fetchVenue) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setVenueId(event.getVenueId());
        response.setEventDate(event.getEventDate());
        response.setStartTime(event.getEventDate()); // alias for Booking Service
        response.setMaxAttendeesPerUser(event.getMaxAttendeesPerUser());
        response.setBudget(event.getBudget());
        response.setCostPerTicket(event.getCostPerTicket());
        response.setDescription(event.getDescription());
        response.setCreatedBy(event.getCreatedBy());
        response.setUpdatedBy(event.getUpdatedBy());
        response.setStatus(event.getStatus());
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());

        if (fetchVenue && event.getVenueId() != null) {
            venueRepository.findById(event.getVenueId()).ifPresent(venue -> {
                response.setCapacity(venue.getCapacity());
            });
        }
        return response;
    }
}
