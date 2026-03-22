package com.eventzen.eventservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class EventVendorAssignRequest {

    @NotNull(message = "Agreed price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Agreed price must be non-negative")
    private BigDecimal agreedPrice;

    private String notes;

    public BigDecimal getAgreedPrice() {
        return agreedPrice;
    }

    public void setAgreedPrice(BigDecimal agreedPrice) {
        this.agreedPrice = agreedPrice;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
