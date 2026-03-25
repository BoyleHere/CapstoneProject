package com.eventzen.eventservice.controller;

import com.eventzen.eventservice.dto.EventRequest;
import com.eventzen.eventservice.dto.EventResponse;
import com.eventzen.eventservice.exception.ForbiddenException;
import com.eventzen.eventservice.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EventControllerTest {

    @Mock
    private EventService eventService;

    @Mock
    private HttpServletRequest httpRequest;

    @InjectMocks
    private EventController eventController;

    private EventRequest mockRequest;
    private EventResponse mockResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockRequest = new EventRequest();
        mockRequest.setName("Annual Tech Summit");
        mockRequest.setDescription("A massive tech gathering.");
        mockRequest.setVenueId(1L);
        mockRequest.setBudget(new BigDecimal("10000.00"));
        mockRequest.setCostPerTicket(new BigDecimal("150.00"));
        mockRequest.setMaxAttendeesPerUser(5);

        mockResponse = new EventResponse();
        mockResponse.setId(100L);
        mockResponse.setName("Annual Tech Summit");
    }

    @Test
    void testCreateEvent_AsAdmin_ReturnsCreated() {
        when(httpRequest.getAttribute("role")).thenReturn("ADMIN");
        when(httpRequest.getAttribute("userId")).thenReturn(1L);
        when(eventService.createEvent(any(EventRequest.class), eq(1L))).thenReturn(mockResponse);

        ResponseEntity<EventResponse> response = eventController.createEvent(mockRequest, httpRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(100L, response.getBody().getId());
        verify(eventService, times(1)).createEvent(any(), eq(1L));
    }

    @Test
    void testCreateEvent_AsCustomer_ThrowsForbidden() {
        when(httpRequest.getAttribute("role")).thenReturn("CUSTOMER");
        when(httpRequest.getAttribute("userId")).thenReturn(2L);

        assertThrows(ForbiddenException.class, () -> {
            eventController.createEvent(mockRequest, httpRequest);
        });
        
        verify(eventService, never()).createEvent(any(), anyLong());
    }

    @Test
    void testGetActiveEvents_ReturnsList() {
        when(eventService.getActiveEvents(null, null, null))
                .thenReturn(Collections.singletonList(mockResponse));

        List<EventResponse> responses = eventController.getActiveEvents(null, null, null);

        assertEquals(1, responses.size());
        assertEquals(100L, responses.get(0).getId());
    }

    @Test
    void testGetEventById_ReturnsEvent() {
        when(eventService.getActiveEventById(100L)).thenReturn(mockResponse);

        EventResponse response = eventController.getEventById(100L);

        assertNotNull(response);
        assertEquals(100L, response.getId());
    }
}
