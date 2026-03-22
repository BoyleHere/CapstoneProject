package com.eventzen.eventservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String name;
    private Long venueId;
    private LocalDateTime eventDate;
    private LocalDateTime startTime;   // alias for eventDate — used by Booking Service
    private Integer maxAttendeesPerUser;
    private Integer capacity; // Venue capacity
    private BigDecimal budget;
    private BigDecimal costPerTicket;
    private String description;
    private Long createdBy;
    private Long updatedBy;
    private Byte status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public Integer getMaxAttendeesPerUser() {
        return maxAttendeesPerUser;
    }

    public void setMaxAttendeesPerUser(Integer maxAttendeesPerUser) {
        this.maxAttendeesPerUser = maxAttendeesPerUser;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public BigDecimal getCostPerTicket() {
        return costPerTicket;
    }

    public void setCostPerTicket(BigDecimal costPerTicket) {
        this.costPerTicket = costPerTicket;
    }
}
