/**
 * Renders a JSON-LD script tag safely (SEO-07/08).
 *
 * The replace() call escapes literal less-than signs so a description
 * containing the closing script tag sequence can never break out of the
 * JSON-LD block. Note: the replacement must be a JS string containing a
 * literal backslash followed by "u003c" (i.e. an escaped backslash in the
 * source) — writing the already-decoded single-character form is a no-op,
 * since the JS parser resolves that escape before .replace() ever sees it.
 * See lib/seo.test.ts for the regression test locking this in.
 */
export function escapeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(data) }}
    />
  )
}
