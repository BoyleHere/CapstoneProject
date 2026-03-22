package com.eventzen.bookingservice.dto;

import com.eventzen.bookingservice.entity.BookingStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.List;

public class UpdateBookingRequest {

    @Valid
    @Size(min = 1, message = "At least one attendee is required if updating attendees")
    private List<AttendeeDTO> attendees;

    private BookingStatus bookingStatus;

    public List<AttendeeDTO> getAttendees() {
        return attendees;
    }

    public void setAttendees(List<AttendeeDTO> attendees) {
        this.attendees = attendees;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
}
