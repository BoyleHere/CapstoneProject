package com.eventzen.eventservice.repository;

import com.eventzen.eventservice.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VenueRepository extends JpaRepository<Venue, Long> {

    Optional<Venue> findByIdAndStatus(Long id, Integer status);

    @Query("""
            SELECT v FROM Venue v
            WHERE v.status = :status
                AND (:location IS NULL OR LOWER(v.location) LIKE LOWER(CONCAT('%', :location, '%')))
                AND (:capacity IS NULL OR v.capacity >= :capacity)
                AND (:dateStr IS NULL OR NOT EXISTS (
                    SELECT e FROM Event e
                    WHERE e.venueId = v.id
                      AND e.status = 1
                      AND FUNCTION('DATE', e.eventDate) = FUNCTION('DATE', CAST(:dateStr AS date))
                ))
            """)
    List<Venue> searchActiveVenues(@Param("status") Integer status,
            @Param("location") String location,
            @Param("capacity") Integer capacity,
            @Param("dateStr") String dateStr);
}
