// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4958ea311e8e6eb25386e9a4131a6275@o4511264103858176.ingest.us.sentry.io/4511264160088064",

  // Capture 10% of transactions for performance monitoring.
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  sendDefaultPii: false,
});
