package com.eventzen.eventservice.service;

import com.eventzen.eventservice.dto.VendorRequest;
import com.eventzen.eventservice.dto.VendorResponse;

import java.util.List;

public interface VendorService {

    VendorResponse createVendor(VendorRequest request, Long actorUserId);

    List<VendorResponse> getActiveVendors();

    VendorResponse getActiveVendorById(Long id);

    VendorResponse updateVendor(Long id, VendorRequest request, Long actorUserId);

    void softDeleteVendor(Long id, Long actorUserId);
}
