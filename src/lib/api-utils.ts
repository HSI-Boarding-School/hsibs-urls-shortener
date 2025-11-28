import { NextResponse } from "next/server";
import { ApiResponse, ApiError } from "@/types/api";

/**
 * Success response helper
 */
export function succesResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

/**
 * Validation error (400)
 */
export function validationError(message: string, details?: any) {
  return errorResponse(message, 400, "VALIDATION_ERROR", details);
}

/**
 * Not found error (404)
 */
export function notFoundError(message: string = "Resource not found") {
  return errorResponse(message, 404, "NOT_FOUND");
}

/**
 * Server error (500)
 */
export function serverError(message: string = "Internal server error") {
  return errorResponse(message, 500, "SERVER_ERROR");
}

/**
 * Unauthorized error (401)
 */
export function unauthorizedError(message: string = "Unauthorized") {
  return errorResponse(message, 401, "UNAUTHORIZED");
}


// ==================
// Request Validation
// ==================

/**
 * Parse dan validate JSON body
 */
export async function parseRequestBody<T>(
  request: Request
): Promise<{ data: T | null; error: string | null }> {
  try {
    const body = await request.json()
    return { data: body as T, error: null }
  } catch (error) {
    return { 
      data: null, 
      error: 'Invalid JSON body' 
    }
  }
}

export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(field => {
    const value = data[field]
    return value === undefined || value === null || value === ''
  })

  return {
    valid: missing.length === 0,
    missing: missing as string[]
  }
}