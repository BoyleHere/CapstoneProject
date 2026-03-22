package com.eventzen.bookingservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AttendeeDTO {

    @NotBlank(message = "Attendee name is required")
    @Size(max = 100, message = "Attendee name can be at most 100 characters")
    private String name;

    @NotBlank(message = "Attendee email is required")
    @Email(message = "Attendee email is invalid")
    @Size(max = 150, message = "Attendee email can be at most 150 characters")
    private String email;

    @NotBlank(message = "Attendee phone is required")
    @Size(max = 20, message = "Attendee phone can be at most 20 characters")
    private String phone;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
