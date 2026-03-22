package com.eventzen.eventservice.repository;

import com.eventzen.eventservice.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByIdAndStatus(Long id, Byte status);

    List<Vendor> findAllByStatusOrderByNameAsc(Byte status);
}
