package com.eventzen.eventservice.service;

import com.eventzen.eventservice.dto.VendorRequest;
import com.eventzen.eventservice.dto.VendorResponse;
import com.eventzen.eventservice.exception.NotFoundException;
import com.eventzen.eventservice.model.Vendor;
import com.eventzen.eventservice.repository.VendorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorServiceImpl implements VendorService {

    private static final byte ACTIVE = 1;
    private static final byte DELETED = 0;

    private final VendorRepository vendorRepository;

    public VendorServiceImpl(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @Override
    public VendorResponse createVendor(VendorRequest request, Long actorUserId) {
        Vendor vendor = new Vendor();
        vendor.setName(request.getName());
        vendor.setServiceType(request.getServiceType());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setPrice(request.getPrice());
        vendor.setCreatedBy(actorUserId);
        vendor.setUpdatedBy(actorUserId);
        vendor.setStatus(ACTIVE);

        return toResponse(vendorRepository.save(vendor));
    }

    @Override
    public List<VendorResponse> getActiveVendors() {
        return vendorRepository.findAllByStatusOrderByNameAsc(ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public VendorResponse getActiveVendorById(Long id) {
        Vendor vendor = vendorRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Vendor not found"));
        return toResponse(vendor);
    }

    @Override
    public VendorResponse updateVendor(Long id, VendorRequest request, Long actorUserId) {
        Vendor vendor = vendorRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Vendor not found"));

        vendor.setName(request.getName());
        vendor.setServiceType(request.getServiceType());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setPrice(request.getPrice());
        vendor.setUpdatedBy(actorUserId);

        return toResponse(vendorRepository.save(vendor));
    }

    @Override
    public void softDeleteVendor(Long id, Long actorUserId) {
        Vendor vendor = vendorRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Vendor not found"));

        vendor.setStatus(DELETED);
        vendor.setUpdatedBy(actorUserId);
        vendorRepository.save(vendor);
    }

    private VendorResponse toResponse(Vendor vendor) {
        VendorResponse response = new VendorResponse();
        response.setId(vendor.getId());
        response.setName(vendor.getName());
        response.setServiceType(vendor.getServiceType());
        response.setEmail(vendor.getEmail());
        response.setPhone(vendor.getPhone());
        response.setPrice(vendor.getPrice());
        response.setCreatedBy(vendor.getCreatedBy());
        response.setUpdatedBy(vendor.getUpdatedBy());
        response.setStatus(vendor.getStatus());
        response.setCreatedAt(vendor.getCreatedAt());
        response.setUpdatedAt(vendor.getUpdatedAt());
        return response;
    }
}
