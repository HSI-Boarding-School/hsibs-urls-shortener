import { succesResponse, validationError } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { isValidShortCode, sanitizeInput } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const sanitized = sanitizeInput(code);

    // validate format
    if (!isValidShortCode(sanitized)) {
      return validationError("Invalid short code format");
    }

    // check availability
    const exist = await db.urls.shortCodeExist(sanitized);

    return succesResponse({
      sanitized,
      available: !exist,
      message: exist
        ? "Short code is already taken"
        : "Short code is available",
    });
  } catch (error) {
    console.error("GET api/urls/check/[code] error : ", error);
    return succesResponse({
      code: "unknown",
      available: false,
      message: "Error checking availability",
    });
  }
}
