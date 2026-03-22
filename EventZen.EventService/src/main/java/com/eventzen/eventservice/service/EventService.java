package com.eventzen.eventservice.service;

import com.eventzen.eventservice.dto.EventRequest;
import com.eventzen.eventservice.dto.EventResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface EventService {

    EventResponse createEvent(EventRequest request, Long actorUserId);

    List<EventResponse> getActiveEvents(Long venueId, LocalDateTime fromDate, LocalDateTime toDate);

    EventResponse getActiveEventById(Long id);

    EventResponse updateEvent(Long id, EventRequest request, Long actorUserId);

    void softDeleteEvent(Long id, Long actorUserId);
}
