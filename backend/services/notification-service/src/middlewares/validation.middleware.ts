import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import ApiError from "../lib/ApiError.js";

const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new ApiError(
          400,
          result.error.issues.map((err) => err.message).join(", ")
        )
      );
    }

    req.body = result.data;

    next();
  };

export default validate;