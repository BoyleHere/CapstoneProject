package com.eventzen.bookingservice.dto;

public class EventStatsResponse {

    private int totalBooked;
    private int remainingCapacity;

    public EventStatsResponse() {
    }

    public EventStatsResponse(int totalBooked, int remainingCapacity) {
        this.totalBooked = totalBooked;
        this.remainingCapacity = remainingCapacity;
    }

    public int getTotalBooked() {
        return totalBooked;
    }

    public void setTotalBooked(int totalBooked) {
        this.totalBooked = totalBooked;
    }

    public int getRemainingCapacity() {
        return remainingCapacity;
    }

    public void setRemainingCapacity(int remainingCapacity) {
        this.remainingCapacity = remainingCapacity;
    }
}
