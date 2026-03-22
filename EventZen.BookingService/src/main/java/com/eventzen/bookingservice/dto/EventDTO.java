package com.eventzen.bookingservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventDTO {

    private Long id;
    private Integer capacity;
    private Integer maxAttendeesPerUser;
    private LocalDateTime startTime;
    private BigDecimal costPerTicket;
    private Integer status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getMaxAttendeesPerUser() {
        return maxAttendeesPerUser;
    }

    public void setMaxAttendeesPerUser(Integer maxAttendeesPerUser) {
        this.maxAttendeesPerUser = maxAttendeesPerUser;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public BigDecimal getCostPerTicket() {
        return costPerTicket;
    }

    public void setCostPerTicket(BigDecimal costPerTicket) {
        this.costPerTicket = costPerTicket;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
