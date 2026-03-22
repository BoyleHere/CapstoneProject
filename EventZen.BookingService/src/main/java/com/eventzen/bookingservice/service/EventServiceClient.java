package com.eventzen.bookingservice.service;

import com.eventzen.bookingservice.dto.EventDTO;
import com.eventzen.bookingservice.exception.BadRequestException;
import com.eventzen.bookingservice.exception.ResourceNotFoundException;
import com.eventzen.bookingservice.exception.ServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
public class EventServiceClient {

    private final RestTemplate restTemplate;
    private final String eventServiceBaseUrl;

    public EventServiceClient(RestTemplate restTemplate,
                              @Value("${event.service.base-url}") String eventServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.eventServiceBaseUrl = eventServiceBaseUrl;
    }

    public EventDTO getEvent(Long eventId, String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new BadRequestException("Authorization header is missing");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, authorizationHeader);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<EventDTO> response = restTemplate.exchange(
                    eventServiceBaseUrl + "/events/" + eventId,
                    HttpMethod.GET,
                    requestEntity,
                    EventDTO.class
            );
            EventDTO event = response.getBody();
            if (event == null) {
                throw new ResourceNotFoundException("Event not found");
            }
            return event;
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Event not found");
        } catch (HttpClientErrorException ex) {
            throw new BadRequestException("Could not fetch event details");
        } catch (HttpServerErrorException | ResourceAccessException ex) {
            throw new ServiceUnavailableException("Event service is unavailable");
        }
    }
}
