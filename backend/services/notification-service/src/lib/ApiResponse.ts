import { Response } from "express";

interface SuccessResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
}

class ApiResponse {
  static success<T>(
    res: Response,
    { statusCode, message, data }: SuccessResponse<T>
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    statusCode: number,
    message: string
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

export default ApiResponse;