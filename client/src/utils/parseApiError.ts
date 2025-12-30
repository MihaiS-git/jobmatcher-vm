import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ErrorResponse } from "../types/ErrorResponse";

/* function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    typeof (data as Record<string, unknown>).status === "number" &&
    "message" in data &&
    typeof (data as Record<string, unknown>).message === "string"
  );
} */

function hasErrorField(data: unknown): data is { error: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as Record<string, unknown>).error === "string"
  );
}

export function parseApiError(err: unknown): string {
  if (import.meta.env.DEV) {
    console.log("parseApiError got error:", err);
  }

  
  if (typeof err === "object" && err !== null && "status" in err) {
    const e = err as FetchBaseQueryError;

    if (e.status === "FETCH_ERROR") {
      return "Network error: Unable to reach the server.";
    }

    if (e.status === "TIMEOUT_ERROR") {
      return "Request timed out. Please try again later.";
    }

    if (e.status === "PARSING_ERROR") {
      return "Failed to parse server response.";
    }

    if (e.status === "CUSTOM_ERROR" && hasErrorField(e)) {
      return e.error;
    }

    if (typeof e.status === "number" && e.data && typeof e.data === "object") {
      const data = e.data as ErrorResponse & { errorCode?: string; validationErrors?: Record<string, string> };

      // Handle validation errors specifically
      if (data.errorCode === "VALIDATION_FAILED" && data.validationErrors) {
        // return the first validation error message
        const firstError = Object.values(data.validationErrors)[0];
        return firstError || "Validation failed.";
      }

      // fallback to standard message
      if (typeof data.message === "string") {
        return data.message;
      }

      return `Error ${e.status}`;
    }

    if (hasErrorField(e)) {
      return (e as { error: string }).error;
    }
  }

  if (err instanceof Error) {
    if (err.message === "Failed to fetch") {
      return "Network error: Unable to connect to the server.";
    }
    return err.message;
  }

  if (import.meta.env.DEV) {
    console.error("Unhandled API error:", err);
  }

  return "An unexpected error occurred. Please try again later or contact support if the problem persists.";
}

interface ValidationErrorResponse extends ErrorResponse {
  validationErrors?: Record<string, string>;
}

export function parseValidationErrors(
  err: unknown
): { message: string; validationErrors?: Record<string, string> } {
  if (typeof err === "object" && err !== null && "status" in err) {
    const e = err as FetchBaseQueryError & { data?: unknown };

    if (typeof e.status === "number" && e.data && typeof e.data === "object") {
      // Narrow down the data type safely
      const data = e.data as ValidationErrorResponse;

      if (
        data.validationErrors &&
        typeof data.validationErrors === "object" &&
        !Array.isArray(data.validationErrors)
      ) {
        return {
          message: data.message ?? `Error ${e.status}`,
          validationErrors: data.validationErrors,
        };
      }

      if (typeof data.message === "string") {
        return { message: data.message };
      }

      return { message: `Error ${e.status}` };
    }
  }

  return { message: "An unexpected error occurred." };
}