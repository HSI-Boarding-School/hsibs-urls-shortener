import { succesResponse, validationError } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { isValidShortCode, sanitizeInput } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  {params}: {params: {code: string}}
) {
  try {
    const code = sanitizeInput(params.code)

    // validate format 
    if (!isValidShortCode(code)) {
      return validationError('Invalid short code format')
    }

    // check availability
    const exist = await db.urls.shortCodeExist(code)

    return succesResponse({
      code,
      available: !exist,
      message: exist 
      ? 'Short code is already taken'
      : 'Short code is available'
    }
    )
  } catch (error) {
    console.error('GET api/urls/check/[code] error : ', error)
    return succesResponse({
      code: params.code,
      available: false,
      message: 'Error checking availability'
    })
  }
}