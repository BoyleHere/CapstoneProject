package com.eventzen.eventservice.controller;

import com.eventzen.eventservice.dto.CreateVenueRequest;
import com.eventzen.eventservice.dto.UpdateVenueRequest;
import com.eventzen.eventservice.dto.VenueResponse;
import com.eventzen.eventservice.exception.ForbiddenException;
import com.eventzen.eventservice.exception.UnauthorizedException;
import com.eventzen.eventservice.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/venues")
@Tag(name = "Venues", description = "Venue management and discovery APIs")
@Validated
public class VenueController {

    private static final String ROLE_ADMIN = "ADMIN";

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @Operation(summary = "Create a venue", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Venue created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PostMapping
    public ResponseEntity<VenueResponse> createVenue(@Valid @RequestBody CreateVenueRequest request,
                                                     HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        VenueResponse response = venueService.createVenue(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get all active venues with optional filters")
    @GetMapping
    public ResponseEntity<List<VenueResponse>> getVenues(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) @Min(value = 1, message = "capacity must be at least 1") Integer capacity) {
        return ResponseEntity.ok(venueService.getVenues(location, date, capacity));
    }

    @Operation(summary = "Get active venue by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Venue found"),
            @ApiResponse(responseCode = "404", description = "Venue not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VenueResponse> getVenueById(@PathVariable Long id) {
        return ResponseEntity.ok(venueService.getVenueById(id));
    }

    @Operation(summary = "Update venue fields", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Venue updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Venue not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<VenueResponse> updateVenue(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateVenueRequest request,
                                                     HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        return ResponseEntity.ok(venueService.updateVenue(id, request, userId));
    }

    @Operation(summary = "Soft delete venue", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Venue deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Venue not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id, HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        venueService.deleteVenue(id, userId);
        return ResponseEntity.noContent().build();
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
