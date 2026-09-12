import type { NextFunction, Request, Response } from "express";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

/**
 * In-memory rate limiter store
 * In production, use Redis for distributed rate limiting
 */
const store = new Map<string, RateLimitEntry>();

/**
 * Rate Limiting Middleware
 * Limits requests per window per IP address
 */
export function rateLimiter(options: RateLimiterOptions) {
  const { windowMs, maxRequests, message } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    let entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime: now + windowMs };
      store.set(key, entry);
    } else {
      entry.count++;
    }

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - entry.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetTime / 1000));

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.status(429).json({
        type: "https://hitsanat.kfl/errors/429",
        title: "Too Many Requests",
        status: 429,
        detail: message || `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      });
      return;
    }

    next();
  };
}

/**
 * Public API rate limiter: 100 requests per minute
 */
export const publicRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  message: "Too many requests to public API. Please try again later.",
});

/**
 * Auth rate limiter: 10 requests per minute (brute force prevention)
 */
export const authRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: "Too many authentication attempts. Please try again later.",
});

/**
 * Registration rate limiter: 5 requests per hour
 */
export const registrationRateLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: "Too many registration attempts. Please try again later.",
});
