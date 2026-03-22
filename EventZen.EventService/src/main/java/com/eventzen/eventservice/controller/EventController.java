package com.eventzen.eventservice.controller;

import com.eventzen.eventservice.dto.EventRequest;
import com.eventzen.eventservice.dto.EventResponse;
import com.eventzen.eventservice.dto.MessageResponse;
import com.eventzen.eventservice.exception.ForbiddenException;
import com.eventzen.eventservice.exception.UnauthorizedException;
import com.eventzen.eventservice.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/events")
@Tag(name = "Events", description = "Event CRUD APIs")
public class EventController {

    private static final String ROLE_ADMIN = "ADMIN";

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @Operation(summary = "Create event", description = "ADMIN only")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request,
                                                     HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        EventResponse created = eventService.createEvent(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "List active events", description = "All authenticated roles. Optional filters: venueId, fromDate, toDate")
    public List<EventResponse> getActiveEvents(
            @RequestParam(required = false) Long venueId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        return eventService.getActiveEvents(venueId, fromDate, toDate);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get active event by ID", description = "All authenticated roles")
    public EventResponse getEventById(@PathVariable Long id) {
        return eventService.getActiveEventById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update event", description = "ADMIN only")
    public EventResponse updateEvent(@PathVariable Long id,
                                     @Valid @RequestBody EventRequest request,
                                     HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        return eventService.updateEvent(id, request, userId);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete event", description = "ADMIN only")
    public ResponseEntity<MessageResponse> softDeleteEvent(@PathVariable Long id,
                                                           HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        eventService.softDeleteEvent(id, userId);
        return ResponseEntity.ok(new MessageResponse("Event deleted successfully"));
    }

    private void enforceAdmin(HttpServletRequest request) {
        Object roleObj = request.getAttribute("role");
        if (roleObj == null) {
            throw new UnauthorizedException("User role is missing in JWT claims");
        }

        String role = String.valueOf(roleObj);
        if (!ROLE_ADMIN.equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN can perform this action");
        }
    }

    private Long extractUserId(HttpServletRequest request) {
        Object userIdObj = request.getAttribute("userId");
        if (userIdObj == null) {
            throw new UnauthorizedException("User ID is missing in JWT claims");
        }

        try {
            return Long.parseLong(String.valueOf(userIdObj));
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Invalid user ID in JWT claims");
        }
    }
}
