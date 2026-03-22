package com.eventzen.bookingservice.repository;

import com.eventzen.bookingservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
