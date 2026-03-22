package com.eventzen.bookingservice.repository;

import com.eventzen.bookingservice.entity.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
}
