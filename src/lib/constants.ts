export const TABLES = {
  URLS: "urls_linkq",
} as const;

// app configuration
export const APP_CONFIG = {
  SHORT_CODE_LENGTH: 6,
  MAX_RETRIES: 5,
  BASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000",
} as const;
