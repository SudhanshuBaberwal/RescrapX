import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues,
      });
    }

    // Replace req.body with parsed data
    req.body = result.data;

    next();
  };

export default validate;
