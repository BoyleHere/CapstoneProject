package com.eventzen.bookingservice.repository;

import com.eventzen.bookingservice.entity.Booking;
import com.eventzen.bookingservice.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT COALESCE(SUM(b.attendeeCount), 0)
            FROM Booking b
            WHERE b.userId = :userId
              AND b.eventId = :eventId
              AND b.bookingStatus <> :cancelledStatus
              AND b.status = 1
            """)
    int getTotalAttendeesByUser(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId,
            @Param("cancelledStatus") BookingStatus cancelledStatus
    );

    @Query("""
            SELECT COALESCE(SUM(b.attendeeCount), 0)
            FROM Booking b
            WHERE b.eventId = :eventId
              AND b.bookingStatus = :approvedStatus
              AND b.status = 1
            """)
    int getTotalAttendeesForEvent(
            @Param("eventId") Long eventId,
            @Param("approvedStatus") BookingStatus approvedStatus
    );

    List<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Integer status);

    Optional<Booking> findByIdAndStatus(Long id, Integer status);

    Page<Booking> findByStatus(Integer status, Pageable pageable);

    List<Booking> findByEventIdAndBookingStatusAndStatus(Long eventId, BookingStatus bookingStatus, Integer status);
}
