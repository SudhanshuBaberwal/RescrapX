import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
   try {
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
   } catch (error) {
    console.log(error)
   }
  };

export default validate;
