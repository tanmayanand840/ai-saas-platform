const config = window.__APP_CONFIG__ || {};

export const API_URL = import.meta.env.DEV
  ? "/api"  // use Vite proxy in dev (avoids cross-origin issues with Clerk tokens)
  : config.API_URL || "/api";
export const CLERK_PUBLISHABLE_KEY =
  config.CLERK_PUBLISHABLE_KEY || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
