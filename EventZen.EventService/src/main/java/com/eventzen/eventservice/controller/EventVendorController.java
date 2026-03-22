package com.eventzen.eventservice.controller;

import com.eventzen.eventservice.dto.EventVendorAssignRequest;
import com.eventzen.eventservice.dto.EventVendorResponse;
import com.eventzen.eventservice.dto.MessageResponse;
import com.eventzen.eventservice.exception.ForbiddenException;
import com.eventzen.eventservice.exception.UnauthorizedException;
import com.eventzen.eventservice.service.EventVendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/events/{eventId}/vendors")
@Tag(name = "Event Vendors", description = "Event to Vendor assignment APIs")
public class EventVendorController {

    private static final String ROLE_ADMIN = "ADMIN";

    private final EventVendorService eventVendorService;

    public EventVendorController(EventVendorService eventVendorService) {
        this.eventVendorService = eventVendorService;
    }

    @PostMapping("/{vendorId}")
    @Operation(summary = "Assign vendor to event", description = "ADMIN only")
    public ResponseEntity<EventVendorResponse> assignVendor(@PathVariable Long eventId,
                                                            @PathVariable Long vendorId,
                                                            @Valid @RequestBody EventVendorAssignRequest request,
                                                            HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        EventVendorResponse created = eventVendorService.assignVendorToEvent(eventId, vendorId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "Get vendors for event", description = "All authenticated roles")
    public List<EventVendorResponse> getVendorsByEvent(@PathVariable Long eventId) {
        return eventVendorService.getVendorsByEventId(eventId);
    }

    @DeleteMapping("/{vendorId}")
    @Operation(summary = "Remove vendor from event", description = "ADMIN only")
    public ResponseEntity<MessageResponse> removeVendor(@PathVariable Long eventId,
                                                        @PathVariable Long vendorId,
                                                        HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        eventVendorService.removeVendorFromEvent(eventId, vendorId, userId);
        return ResponseEntity.ok(new MessageResponse("Vendor removed from event successfully"));
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
