package com.eventzen.eventservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class EventVendorId implements Serializable {

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "vendor_id")
    private Long vendorId;

    public EventVendorId() {
    }

    public EventVendorId(Long eventId, Long vendorId) {
        this.eventId = eventId;
        this.vendorId = vendorId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventVendorId that)) {
            return false;
        }
        return Objects.equals(eventId, that.eventId) && Objects.equals(vendorId, that.vendorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, vendorId);
    }
}
