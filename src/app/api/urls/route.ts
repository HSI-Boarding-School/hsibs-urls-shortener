import {
  errorResponse,
  parseRequestBody,
  serverError,
  succesResponse,
  validateRequiredFields,
  validationError,
} from "@/lib/api-utils";
import { APP_CONFIG } from "@/lib/constants";
import { db } from "@/lib/db";
import {
  generateShortCode,
  isValidShortCode,
  isValidUrl,
  normalizeUrl,
  sanitizeInput,
} from "@/lib/utils";
import { CreateUrlDto } from "@/types/database";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("📨 POST /api/urls - Request received");

    // STEP 1: Parse request body
    const { data: body, error: parseError } =
      await parseRequestBody<CreateUrlDto>(request);

    if (parseError || !body) {
      return validationError(parseError || "Invalid request body");
    }

    console.log("📦 Body:", body);

    // STEP 2: Validate required fields (ONLY original_url)
    const { valid, missing } = validateRequiredFields(body, ["original_url"]);

    if (!valid) {
      return validationError(`Missing required fields: ${missing.join(", ")}`, {
        missing,
      });
    }

    // STEP 3: Sanitize & normalize input
    const originalUrl = sanitizeInput(body.original_url);
    const normalizedUrl = normalizeUrl(originalUrl);

    console.log("🔄 Normalized URL:", normalizedUrl);

    // STEP 4: Validate URL format
    if (!isValidUrl(normalizedUrl)) {
      return validationError("Invalid URL format");
    }

    // STEP 5: Handle short code
    let shortCode = body.short_code;

    if (shortCode) {
      // ✅ User provided custom code
      console.log("🎯 Custom short code provided:", shortCode);

      shortCode = sanitizeInput(shortCode);

      // Validate format
      if (!isValidShortCode(shortCode)) {
        // ✅ Panggil function!
        return validationError(
          "Invalid short code format. Use 3-10 alphanumeric characters (not pure numbers)"
        );
      }

      // Check if taken
      const exists = await db.urls.shortCodeExist(shortCode); // ✅ Nama method benar!
      if (exists) {
        return errorResponse("Short code already taken", 409, "CODE_TAKEN");
      }
    } else {
      // ✅ No custom code → generate random
      console.log("🎲 Generating random short code...");

      let attempts = 0; // ✅ Typo: attemps → attempts
      const maxAttempts = APP_CONFIG.MAX_RETRIES;

      while (attempts < maxAttempts) {
        shortCode = generateShortCode(APP_CONFIG.SHORT_CODE_LENGTH);
        console.log(`   Attempt ${attempts + 1}: "${shortCode}"`);

        const exists = await db.urls.shortCodeExist(shortCode); // ✅
        if (!exists) {
          console.log("   ✅ Available!");
          break;
        }

        console.log("   ❌ Taken, retrying...");
        attempts++;
      }

      if (attempts === maxAttempts) {
        return serverError(
          "Failed to generate unique short code. Please try again."
        );
      }
    }

    console.log(`✅ Using short code: "${shortCode}"`);

    // STEP 6: Insert to database
    const newUrl = await db.urls.create({
      short_code: shortCode,
      original_url: normalizedUrl, // ✅ Pakai normalizedUrl, bukan originalUrl
    });

    if (!newUrl) {
      return serverError("Failed to create short URL");
    }

    console.log("✅ Created:", newUrl);

    // STEP 7: Return success
    return succesResponse(
      newUrl,
      "Short URL created successfully",
      201
    );
  } catch (error) {
    console.error("❌ POST /api/urls error:", error);
    return serverError("An unexpected error occurred");
  }
}

export async function GET(request: NextRequest) {
  try {
    // parse query params untuk pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return validationError("Invalid pagination parameters");
    }

    // get all urls
    const urls = db.urls.getAll();

    // manual pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUrls = (await urls).slice(startIndex, endIndex);

    return succesResponse({
      urls: paginatedUrls,
      pagination: {
        page,
        limit,
        total: (await urls).length,
        totalPages: Math.ceil((await urls).length / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/urls errors:", error);
    return serverError();
  }
}
