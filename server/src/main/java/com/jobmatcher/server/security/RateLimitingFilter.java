package com.jobmatcher.server.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobmatcher.server.model.ErrorCode;
import com.jobmatcher.server.model.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitingFilter extends OncePerRequestFilter {

    // Evict idle IP buckets (prevents memory growth)
    private static final long IDLE_EVICT_MS = Duration.ofMinutes(10).toMillis();

    // Rules: capacity per period
    private static final Rule LOGIN = new Rule(5, Duration.ofMinutes(1));
    private static final Rule RECOVERY = new Rule(3, Duration.ofMinutes(5));
    private static final Rule API = new Rule(300, Duration.ofMinutes(1));

    private final Map<String, Entry> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/actuator");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        Rule rule = ruleFor(request);
        if (rule == null) {
            chain.doFilter(request, response);
            return;
        }

        long nowMs = System.currentTimeMillis();
        String clientIp = getClientIp(request);

        // Keyed by rule + IP (you can later key by userId if authenticated)
        String key = rule.name + ":" + clientIp;

        // Create or refresh entry; evict idle ones
        Entry entry = buckets.compute(key, (k, existing) -> {
            if (existing == null || (nowMs - existing.lastSeenMs) > IDLE_EVICT_MS) {
                return new Entry(new TokenBucket(rule.capacity, rule.periodMs), nowMs);
            }
            existing.lastSeenMs = nowMs;
            return existing;
        });

        // Opportunistic cleanup (cheap) — avoid unbounded growth from many IPs
        if ((nowMs & 0x3FF) == 0) { // roughly 1/1024 requests
            cleanupIdle(nowMs);
        }

        boolean allowed;
        synchronized (entry.bucket) {
            allowed = entry.bucket.tryConsume(1, nowMs);
        }

        if (!allowed) {
            log.warn("Rate limit exceeded [rule={}]", rule.name);

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            // Optional: conservative retry hint
            response.setHeader("Retry-After", "60");

            ErrorResponse body = ErrorResponse.of(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many requests. Please try again later.",
                    request.getRequestURI(),
                    ErrorCode.RATE_LIMIT_EXCEEDED
            );

            response.getWriter().write(objectMapper.writeValueAsString(body));
            return;
        }

        chain.doFilter(request, response);
    }

    private void cleanupIdle(long nowMs) {
        // remove entries not seen recently
        buckets.entrySet().removeIf(e -> (nowMs - e.getValue().lastSeenMs) > IDLE_EVICT_MS);
    }

    private Rule ruleFor(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if ("POST".equals(method) && uri.equals("/api/auth/login")) return LOGIN.withName("LOGIN");
        if ("POST".equals(method) && uri.equals("/api/auth/password-recovery")) return RECOVERY.withName("RECOVERY");
        if ("POST".equals(method) && uri.equals("/api/auth/reset-password")) return RECOVERY.withName("RECOVERY");
        if (uri.startsWith("/api/")) return API.withName("API");

        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        // Prefer X-Forwarded-For (first hop) when behind Nginx
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    // ----- Data structures -----

    private static final class Entry {
        final TokenBucket bucket;
        volatile long lastSeenMs;

        Entry(TokenBucket bucket, long lastSeenMs) {
            this.bucket = bucket;
            this.lastSeenMs = lastSeenMs;
        }
    }

    private static final class Rule {
        final int capacity;
        final long periodMs;
        String name;

        Rule(int capacity, Duration period) {
            this.capacity = capacity;
            this.periodMs = period.toMillis();
        }

        Rule withName(String name) {
            this.name = name;
            return this;
        }
    }

    /**
     * Simple token bucket:
     * - capacity tokens max
     * - refills linearly over periodMs back to full capacity
     */
    private static final class TokenBucket {
        private final int capacity;
        private final long periodMs;

        private double tokens;
        private long lastRefillMs;

        TokenBucket(int capacity, long periodMs) {
            this.capacity = capacity;
            this.periodMs = periodMs;
            this.tokens = capacity;
            this.lastRefillMs = System.currentTimeMillis();
        }

        boolean tryConsume(int n, long nowMs) {
            refill(nowMs);
            if (tokens >= n) {
                tokens -= n;
                return true;
            }
            return false;
        }

        private void refill(long nowMs) {
            long elapsed = nowMs - lastRefillMs;
            if (elapsed <= 0) return;

            double refillRatePerMs = (double) capacity / (double) periodMs;
            tokens = Math.min(capacity, tokens + elapsed * refillRatePerMs);
            lastRefillMs = nowMs;
        }
    }
}
