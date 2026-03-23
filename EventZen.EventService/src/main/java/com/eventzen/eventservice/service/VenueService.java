package com.eventzen.eventservice.service;

import com.eventzen.eventservice.dto.CreateVenueRequest;
import com.eventzen.eventservice.dto.UpdateVenueRequest;
import com.eventzen.eventservice.dto.VenueResponse;
import com.eventzen.eventservice.exception.BadRequestException;
import com.eventzen.eventservice.exception.NotFoundException;
import com.eventzen.eventservice.model.Venue;
import com.eventzen.eventservice.repository.VenueRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class VenueService {

    private static final int ACTIVE = 1;
    private static final int DELETED = 0;

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @Transactional
    public VenueResponse createVenue(CreateVenueRequest request, Long userId) {
        Venue venue = new Venue();
        venue.setName(request.getName().trim());
        venue.setLocation(request.getLocation().trim());
        venue.setCapacity(request.getCapacity());
        venue.setPrice(request.getPrice());
        venue.setDescription(request.getDescription());
        venue.setStatus(ACTIVE);
        venue.setCreatedBy(userId);
        venue.setUpdatedBy(userId);

        Venue saved = venueRepository.save(venue);
        return toResponse(saved);
    }

    public List<VenueResponse> getVenues(String location, String date, Integer capacity) {
        String normalizedLocation = normalizeLocation(location);
        validateDate(date);

        return venueRepository
                .searchActiveVenues(ACTIVE, normalizedLocation, capacity,
                        (date != null && !date.isBlank()) ? date : null)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public VenueResponse getVenueById(Long id) {
        Venue venue = venueRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Venue not found"));
        return toResponse(venue);
    }

    @Transactional
    public VenueResponse updateVenue(Long id, UpdateVenueRequest request, Long userId) {
        Venue venue = venueRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Venue not found"));

        if (request.getCapacity() != null) {
            venue.setCapacity(request.getCapacity());
        }
        if (request.getPrice() != null) {
            venue.setPrice(request.getPrice());
        }
        if (request.getDescription() != null) {
            venue.setDescription(request.getDescription());
        }
        venue.setUpdatedBy(userId);

        Venue updated = venueRepository.save(venue);
        return toResponse(updated);
    }

    @Transactional
    public void deleteVenue(Long id, Long userId) {
        Venue venue = venueRepository.findByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new NotFoundException("Venue not found"));

        venue.setStatus(DELETED);
        venue.setUpdatedBy(userId);
        venueRepository.save(venue);
    }

    private VenueResponse toResponse(Venue venue) {
        VenueResponse response = new VenueResponse();
        response.setId(venue.getId());
        response.setName(venue.getName());
        response.setLocation(venue.getLocation());
        response.setCapacity(venue.getCapacity());
        response.setPrice(venue.getPrice());
        response.setDescription(venue.getDescription());
        response.setStatus(venue.getStatus());
        response.setCreatedAt(venue.getCreatedAt());
        response.setUpdatedAt(venue.getUpdatedAt());
        response.setCreatedBy(venue.getCreatedBy());
        response.setUpdatedBy(venue.getUpdatedBy());
        return response;
    }

    private String normalizeLocation(String location) {
        if (location == null || location.isBlank()) {
            return null;
        }
        return location.trim();
    }

    private void validateDate(String date) {
        if (date == null || date.isBlank()) {
            return;
        }
        try {
            LocalDate.parse(date);
        } catch (DateTimeParseException ex) {
            throw new BadRequestException("date must be in yyyy-MM-dd format");
        }
    }
}
