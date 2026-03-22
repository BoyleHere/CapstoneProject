package com.eventzen.bookingservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(@Value("${security.jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration != null && expiration.before(new Date());
    }

    public Long extractUserId(Claims claims) {
        Object userId = claims.get("userId");
        if (userId == null && claims.getSubject() != null) {
            userId = claims.getSubject();
        }
        if (userId == null) {
            throw new IllegalArgumentException("Missing userId in token");
        }
        return Long.parseLong(String.valueOf(userId));
    }

    public Collection<String> extractRoles(Claims claims) {
        Object rolesObj = claims.get("roles");
        List<String> roles = new ArrayList<>();

        if (rolesObj instanceof Collection<?> collection) {
            for (Object role : collection) {
                roles.add(String.valueOf(role));
            }
            return roles;
        }

        Object singleRole = claims.get("role");
        if (singleRole != null) {
            roles.add(String.valueOf(singleRole));
        }

        return roles;
    }
}
