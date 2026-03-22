package com.eventzen.eventservice.controller;

import com.eventzen.eventservice.dto.MessageResponse;
import com.eventzen.eventservice.dto.VendorRequest;
import com.eventzen.eventservice.dto.VendorResponse;
import com.eventzen.eventservice.exception.ForbiddenException;
import com.eventzen.eventservice.exception.UnauthorizedException;
import com.eventzen.eventservice.service.VendorService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/vendors")
@Tag(name = "Vendors", description = "Vendor CRUD APIs")
public class VendorController {

    private static final String ROLE_ADMIN = "ADMIN";

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @PostMapping
    @Operation(summary = "Create vendor", description = "ADMIN only")
    public ResponseEntity<VendorResponse> createVendor(@Valid @RequestBody VendorRequest request,
                                                       HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        VendorResponse created = vendorService.createVendor(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "List active vendors", description = "All authenticated roles")
    public List<VendorResponse> getActiveVendors() {
        return vendorService.getActiveVendors();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get active vendor by ID", description = "All authenticated roles")
    public VendorResponse getVendorById(@PathVariable Long id) {
        return vendorService.getActiveVendorById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vendor", description = "ADMIN only")
    public VendorResponse updateVendor(@PathVariable Long id,
                                       @Valid @RequestBody VendorRequest request,
                                       HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        return vendorService.updateVendor(id, request, userId);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete vendor", description = "ADMIN only")
    public ResponseEntity<MessageResponse> deleteVendor(@PathVariable Long id,
                                                        HttpServletRequest httpRequest) {
        enforceAdmin(httpRequest);
        Long userId = extractUserId(httpRequest);
        vendorService.softDeleteVendor(id, userId);
        return ResponseEntity.ok(new MessageResponse("Vendor deleted successfully"));
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
