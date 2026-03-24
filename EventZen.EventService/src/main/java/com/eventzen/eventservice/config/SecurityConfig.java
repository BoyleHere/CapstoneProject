package com.eventzen.eventservice.config;

import com.eventzen.eventservice.exception.ApiError;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v1/api-docs/**", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/vendors", "/vendors/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/vendors").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/vendors/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/vendors/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/venues", "/venues/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/venues").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/venues/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/venues/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/events", "/events/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/events/*/vendors/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/events/*/vendors/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/events").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/events/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/events/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) ->
                                writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized",
                                        "Authentication is required", request.getRequestURI()))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                writeErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, "Forbidden",
                                        "You are not allowed to access this resource", request.getRequestURI())))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOriginPatterns(java.util.List.of("*"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);
        
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private void writeErrorResponse(HttpServletResponse response,
                                    int status,
                                    String error,
                                    String message,
                                    String path) throws java.io.IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiError apiError = new ApiError(status, error, message, path);
        String body = "{\"timestamp\":\"" + apiError.getTimestamp() + "\","
                + "\"status\":" + apiError.getStatus() + ","
                + "\"error\":\"" + apiError.getError() + "\","
                + "\"message\":\"" + apiError.getMessage() + "\","
                + "\"path\":\"" + apiError.getPath() + "\"}";

        response.getWriter().write(body);
    }
}
