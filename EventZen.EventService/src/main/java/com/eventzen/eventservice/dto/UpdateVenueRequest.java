package com.eventzen.eventservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class UpdateVenueRequest {

    @Min(value = 1, message = "capacity must be at least 1")
    private Integer capacity;

    @DecimalMin(value = "0.0", inclusive = true, message = "price must be non-negative")
    private BigDecimal price;

    @Size(max = 2000, message = "description cannot exceed 2000 characters")
    private String description;

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
