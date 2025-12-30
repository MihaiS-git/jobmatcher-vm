export interface ErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  errorCode?: string;
  validationErrors?: Record<string, string>;
}