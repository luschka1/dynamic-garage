// Simple in-memory rate limiter — resets on each serverless cold start
// Good enough for low-traffic contact forms

const hits = new Map<string, { count: number; resetAt: number }>()

/**
 * Returns true if the request should be blocked.
 * @param key      — typically the IP address
 * @param limit    — max requests per window
 * @param windowMs — window length in ms
 */
export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (entry.count >= limit) return true

  entry.count++
  return false
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
