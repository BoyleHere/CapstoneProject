package com.eventzen.eventservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    public JwtUtil(@Value("${event.jwt.secret}") String rawSecret) {
        this.secretKey = new SecretKeySpec(rawSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    public Claims validateAndGetClaims(String token) {
        try {
            Jws<Claims> jws = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return jws.getPayload();
        } catch (JwtException ex) {
            throw new IllegalArgumentException("Invalid JWT token", ex);
        }
    }

    public Long extractUserId(Claims claims) {
        Object value = firstNonNull(
                claims.get("userId"),
                claims.get("nameid"),
                claims.get("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"),
                claims.getSubject());

        if (value == null) {
            throw new IllegalArgumentException("JWT does not contain userId claim");
        }

        try {
            return Long.parseLong(String.valueOf(value));
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Invalid userId in JWT", ex);
        }
    }

    public String extractRole(Claims claims) {
        Object value = firstNonNull(
                claims.get("role"),
                claims.get("roles"),
                claims.get("http://schemas.microsoft.com/ws/2008/06/identity/claims/role"));

        if (value == null) {
            throw new IllegalArgumentException("JWT does not contain role claim");
        }

        if (value instanceof List<?> roles && !roles.isEmpty()) {
            return String.valueOf(roles.get(0));
        }

        if (value instanceof Map<?, ?> roleMap && roleMap.containsKey("name")) {
            return String.valueOf(roleMap.get("name"));
        }

        return String.valueOf(value);
    }

    private static Object firstNonNull(Object... values) {
        for (Object value : values) {
            if (Objects.nonNull(value)) {
                return value;
            }
        }
        return null;
    }

}
