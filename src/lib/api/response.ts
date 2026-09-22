import type { ApiResponse } from "@/types/api";

export function apiSuccess<T>(params: {
  message: string;
  data?: T;
  meta?: unknown;
}): ApiResponse<T> {
  return {
    success: true,
    message: params.message,
    ...(params.data !== undefined ? { data: params.data } : {}),
    ...(params.meta !== undefined ? { meta: params.meta } : {}),
  };
}

export function apiError(params: {
  message: string;
  error?: unknown;
  meta?: unknown;
}): ApiResponse {
  return {
    success: false,
    message: params.message,
    ...(params.error !== undefined ? { error: params.error } : {}),
    ...(params.meta !== undefined ? { meta: params.meta } : {}),
  };
}
