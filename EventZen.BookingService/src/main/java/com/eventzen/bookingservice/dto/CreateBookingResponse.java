package com.eventzen.bookingservice.dto;

import com.eventzen.bookingservice.entity.BookingStatus;

public class CreateBookingResponse {

    private Long bookingId;
    private BookingStatus status;

    public CreateBookingResponse() {
    }

    public CreateBookingResponse(Long bookingId, BookingStatus status) {
        this.bookingId = bookingId;
        this.status = status;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
