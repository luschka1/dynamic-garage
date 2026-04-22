import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [Sentry.replayIntegration()],

  // Capture 10% of transactions for performance monitoring.
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Capture 10% of sessions for replay (free tier: 50 replays/mo)
  replaysSessionSampleRate: 0.1,

  // Always capture a replay when an error occurs
  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
