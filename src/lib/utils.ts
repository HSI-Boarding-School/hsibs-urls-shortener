import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/// === Url Shortener Utilities === ///

/**
 * Generate random short code
 * @param length - Desired code length (default: 6)
 * @returns Random alphanumeric string
 * example:
 * generateShortCode(6) → "aB3xY9"
 * generateShortCode(4) → "k2Mn"
 */
export function generateShortCode(length: number = 6): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }

  return result;
}

/**
 *
 * @param url - string to be check
 * @returns true if valid, false if not
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param url - string to be normalize
 * @returns url with protocol
 * 
 * example : 
 * normalizeUrl("google.com") → "https://google.com"
 * normalizeUrl("https://google.com") → "https://google.com"
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

/**
 * @params date - ISO string or Date object
 * @returns formatted date string
 * 
 * example :
 * formatdate(formatDate("2024-03-15T10:30:00Z") → "15 Maret 2024")
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * 
 * @param date - iso string or Date object
 * @returns formatted datetime string
 * 
 * example :
 * formatDateTime("2024-03-15T10:30:00Z") → "15 Maret 2024, 17:30"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * formatted number with separator
 * 
 * @param num - number to be formatted
 * @returns Formatted number string
 * 
 * example:
 * formatNumber(1234) → "1,234"
 * formatNumber(1234567) → "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("id-ID");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for old browser
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      console.error("Failed to copy:", error);
      return false;
    }
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export function isValidShortCode(code: string): boolean {
  // Regex breakdown:
  // ^        : Start of string
  // [a-zA-Z0-9] : Alfanumerik only
  // {3,10}   : 3 until 16 characters
  // $        : End of string
  const alphanumericRegex = /^[a-zA-Z0-9]{3,16}$/;

  if (!alphanumericRegex.test(code)) {
    return false;
  }

  // check if pure numeric (prohibited)
  const pureNumericRegex = /^\d+$/;
  if (pureNumericRegex.test(code)) {
    return false;
  }

  return true;
}

export function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:300";
  }

  return window.location.origin;
}

export function buildShortUrl(shortCode: string): string {
  const base = getBaseUrl();
  return `${base}/${shortCode}`;
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and >
    .slice(0, 500); // Limit length
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 100
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i === maxRetries - 1) {
        throw lastError;
      }

      await sleep(delay * Math.pow(2, i));
    }
  }

  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
