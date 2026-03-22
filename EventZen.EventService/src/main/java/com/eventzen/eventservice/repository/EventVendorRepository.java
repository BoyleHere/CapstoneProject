package com.eventzen.eventservice.repository;

import com.eventzen.eventservice.model.EventVendor;
import com.eventzen.eventservice.model.EventVendorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventVendorRepository extends JpaRepository<EventVendor, EventVendorId> {

    boolean existsByEvent_IdAndVendor_IdAndStatus(Long eventId, Long vendorId, Byte status);

    Optional<EventVendor> findByEvent_IdAndVendor_IdAndStatus(Long eventId, Long vendorId, Byte status);

    List<EventVendor> findAllByEvent_IdAndStatus(Long eventId, Byte status);

    @Query("""
            select case when count(ev) > 0 then true else false end
            from EventVendor ev
            join ev.event e
            where ev.vendor.id = :vendorId
              and ev.status = :activeStatus
              and e.status = :activeStatus
              and e.id <> :eventId
              and e.eventDate = :eventDate
            """)
    boolean existsVendorScheduleConflict(@Param("vendorId") Long vendorId,
                                         @Param("eventId") Long eventId,
                                         @Param("activeStatus") Byte activeStatus,
                                         @Param("eventDate") LocalDateTime eventDate);
}
