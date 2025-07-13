/**
 * Utility functions for common API route patterns
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract access token from request headers or body
 */
export function extractAccessToken(request: NextRequest): string | null {
  // Try to get from Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }

  // Try to get from request body (for backward compatibility)
  return null;
}

/**
 * Extract access token from request body
 */
export async function extractAccessTokenFromBody(request: NextRequest): Promise<string | null> {
  try {
    const body = await request.json();
    return body.accessToken || null;
  } catch {
    return null;
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: any
): NextResponse {
  return NextResponse.json(
    { error: message, ...(details && { details }) },
    { status }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(body: any, requiredFields: string[]): string[] {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!body[field]) {
      missingFields.push(field);
    }
  }
  
  return missingFields;
}

/**
 * Handle Square API errors consistently
 */
export function handleSquareApiError(error: any, operation: string): NextResponse {
  console.error(`Error in ${operation}:`, error);
  
  if (error instanceof Error) {
    return createErrorResponse(`Failed to ${operation}: ${error.message}`, 500);
  }
  
  return createErrorResponse(`Failed to ${operation}`, 500);
}

/**
 * Wrapper for API route handlers with common error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('Unhandled error in API route:', error);
      return createErrorResponse('Internal server error', 500);
    }
  };
} 