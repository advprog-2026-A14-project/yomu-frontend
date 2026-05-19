export type ApiResponse<T> =
  | { success: true; message: string; data: T }
  | { success: true; message: string; data?: undefined }
  | { success: false; message: string; data?: undefined };
