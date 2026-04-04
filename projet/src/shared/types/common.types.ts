export interface ApiError {
  message: string | string[];
  statusCode?: number;
  error?: string;
}
