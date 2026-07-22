/**
 * Structured security event logger.
 *
 * OWASP A09:2025 — Security Logging & Alerting Failures
 *
 * Outputs structured JSON to stdout/stderr for consumption by external
 * observability tools (Datadog, CloudWatch, Vercel Logs, ELK, etc.).
 *
 * Rules:
 *  - Never log PII, credentials, or full request bodies.
 *  - Always include IP (hashed in production if needed), path, and timestamp.
 *  - Use deterministic event types for easy alerting rules.
 */

import { createHash } from 'crypto'

/**
 * RF-015: "identificador de usuario no se loggea en claro en LOGIN_FAILED".
 * A short SHA-256 prefix keeps events for the same username correlatable
 * (e.g. "5 failed attempts for the same hash" is a useful alert signal)
 * without ever writing the actual username to logs.
 */
export function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16)
}

export type SecurityEventType =
  | 'CSRF_VIOLATION'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_FAILURE'
  | 'HONEYPOT_TRIGGERED'
  | 'OVERSIZED_PAYLOAD'
  | 'INVALID_CONTENT_TYPE'
  | 'MALFORMED_BODY'
  | 'SCANNER_PROBE'
  | 'BLOCKED_PATH'
  | 'UNHANDLED_ERROR'
  | 'LOGIN_FAILED'
  | 'LOGIN_SUCCESS'
  | 'LEGACY_ADMIN_CREDENTIAL_ACTIVE'

export interface SecurityEvent {
  type: SecurityEventType
  ip: string
  path: string
  method?: string
  details?: string
}

/**
 * Log a security-relevant event as structured JSON.
 * Uses console.warn so it does not mix with regular application logs.
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const entry = {
    level: 'SECURITY',
    ts: new Date().toISOString(),
    ...event,
  }
  // Server-only — will not be sent to client bundles
  console.warn(JSON.stringify(entry))
}
