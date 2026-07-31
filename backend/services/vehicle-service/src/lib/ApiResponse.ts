import { Response } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

class ApiResponse {
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    } satisfies ApiResponse<T>);
  }
  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: unknown
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    } satisfies ApiResponse);
  }
}

export default ApiResponse;