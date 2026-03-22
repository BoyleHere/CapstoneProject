package com.eventzen.eventservice.service;

import com.eventzen.eventservice.dto.EventVendorAssignRequest;
import com.eventzen.eventservice.dto.EventVendorResponse;

import java.util.List;

public interface EventVendorService {

    EventVendorResponse assignVendorToEvent(Long eventId,
                                            Long vendorId,
                                            EventVendorAssignRequest request,
                                            Long actorUserId);

    List<EventVendorResponse> getVendorsByEventId(Long eventId);

    void removeVendorFromEvent(Long eventId, Long vendorId, Long actorUserId);
}
