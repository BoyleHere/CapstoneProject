package com.eventzen.eventservice.service;

import com.eventzen.eventservice.dto.EventVendorAssignRequest;
import com.eventzen.eventservice.dto.EventVendorResponse;
import com.eventzen.eventservice.exception.ConflictException;
import com.eventzen.eventservice.exception.NotFoundException;
import com.eventzen.eventservice.model.Event;
import com.eventzen.eventservice.model.EventVendor;
import com.eventzen.eventservice.model.EventVendorId;
import com.eventzen.eventservice.model.Vendor;
import com.eventzen.eventservice.repository.EventRepository;
import com.eventzen.eventservice.repository.EventVendorRepository;
import com.eventzen.eventservice.repository.VendorRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventVendorServiceImpl implements EventVendorService {

    private static final byte ACTIVE = 1;
    private static final byte DELETED = 0;

    private final EventRepository eventRepository;
    private final VendorRepository vendorRepository;
    private final EventVendorRepository eventVendorRepository;

    public EventVendorServiceImpl(EventRepository eventRepository,
                                  VendorRepository vendorRepository,
                                  EventVendorRepository eventVendorRepository) {
        this.eventRepository = eventRepository;
        this.vendorRepository = vendorRepository;
        this.eventVendorRepository = eventVendorRepository;
    }

    @Override
    public EventVendorResponse assignVendorToEvent(Long eventId,
                                                   Long vendorId,
                                                   EventVendorAssignRequest request,
                                                   Long actorUserId) {
        Event event = eventRepository.findByIdAndStatus(eventId, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        Vendor vendor = vendorRepository.findByIdAndStatus(vendorId, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Vendor not found"));

        if (eventVendorRepository.existsByEvent_IdAndVendor_IdAndStatus(eventId, vendorId, ACTIVE)) {
            throw new ConflictException("Vendor is already assigned to this event");
        }

        boolean scheduleConflict = eventVendorRepository.existsVendorScheduleConflict(
                vendorId,
                eventId,
                ACTIVE,
                event.getEventDate());

        if (scheduleConflict) {
            throw new ConflictException("Vendor is unavailable for the selected event time");
        }

        EventVendor assignment = new EventVendor();
        assignment.setId(new EventVendorId(eventId, vendorId));
        assignment.setEvent(event);
        assignment.setVendor(vendor);
        assignment.setCreatedBy(actorUserId);
        assignment.setUpdatedBy(actorUserId);
        assignment.setStatus(ACTIVE);

        return toResponse(saveWithDuplicateTranslation(assignment));
    }

    @Override
    public List<EventVendorResponse> getVendorsByEventId(Long eventId) {
        eventRepository.findByIdAndStatus(eventId, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        return eventVendorRepository.findAllByEvent_IdAndStatus(eventId, ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void removeVendorFromEvent(Long eventId, Long vendorId, Long actorUserId) {
        EventVendor assignment = eventVendorRepository.findByEvent_IdAndVendor_IdAndStatus(eventId, vendorId, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Vendor assignment not found"));

        assignment.setStatus(DELETED);
        assignment.setUpdatedBy(actorUserId);
        eventVendorRepository.save(assignment);
    }

    private EventVendor saveWithDuplicateTranslation(EventVendor assignment) {
        try {
            return eventVendorRepository.save(assignment);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("Vendor is already assigned to this event");
        }
    }

    private EventVendorResponse toResponse(EventVendor assignment) {
        EventVendorResponse response = new EventVendorResponse();
        response.setEventId(assignment.getEvent().getId());
        response.setVendorId(assignment.getVendor().getId());
        response.setVendorName(assignment.getVendor().getName());
        response.setServiceType(assignment.getVendor().getServiceType());
        response.setCreatedAt(assignment.getCreatedAt());
        response.setUpdatedAt(assignment.getUpdatedAt());
        return response;
    }
}
