export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface ApiError {
  success: false;
  error: string;
  data: null;
} 