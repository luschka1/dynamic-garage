"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0f0f10', color: '#f5f5f3', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'rgba(245,245,243,0.5)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
            An unexpected error occurred. Our team has been notified automatically.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#e03535', color: '#fff', border: 'none',
              padding: '0.75rem 1.75rem', borderRadius: 8, fontSize: '0.9rem',
              fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
