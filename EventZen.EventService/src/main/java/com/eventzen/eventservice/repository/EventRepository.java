package com.eventzen.eventservice.repository;

import com.eventzen.eventservice.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    Optional<Event> findByIdAndStatus(Long id, Byte status);

    List<Event> findAllByStatusOrderByEventDateAsc(Byte status);

        @Query("""
                        select e
                        from Event e
                        where e.status = :status
                            and (:venueId is null or e.venueId = :venueId)
                            and (:fromDate is null or e.eventDate >= :fromDate)
                            and (:toDate is null or e.eventDate <= :toDate)
                        order by e.eventDate asc
                        """)
        List<Event> findActiveEventsWithFilters(@Param("status") Byte status,
                                                                                        @Param("venueId") Long venueId,
                                                                                        @Param("fromDate") LocalDateTime fromDate,
                                                                                        @Param("toDate") LocalDateTime toDate);

    boolean existsByVenueIdAndEventDateAndStatus(Long venueId, LocalDateTime eventDate, Byte status);

    boolean existsByVenueIdAndEventDateAndStatusAndIdNot(Long venueId,
                                                         LocalDateTime eventDate,
                                                         Byte status,
                                                         Long id);
}
