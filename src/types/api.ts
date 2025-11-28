/**
 * Success response
 */
export interface ApiResponse<T = any> {
  success: true
  data: T
  message?: string
}

/**
 * Error response
 */
export interface ApiError {
  success: false
  error: {
    message: string
    code?: string
    details?: any
  }
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}