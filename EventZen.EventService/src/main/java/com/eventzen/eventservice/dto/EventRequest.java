package com.eventzen.eventservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventRequest {

    @NotBlank(message = "Event name is required")
    @Size(max = 150, message = "Event name must be at most 150 characters")
    private String name;

    @NotNull(message = "Venue ID is required")
    private Long venueId;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    @Min(value = 0, message = "maxAttendeesPerUser must be 0 or greater")
    private Integer maxAttendeesPerUser;

    @DecimalMin(value = "0.0", message = "Budget cannot be negative")
    private BigDecimal budget;

    @DecimalMin(value = "0.0", message = "Cost per ticket cannot be negative")
    private BigDecimal costPerTicket;

    private String description;

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
