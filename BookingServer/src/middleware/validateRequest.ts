import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      const parsedData = schema.parse(req.body);

      (req as any).value = (req as any).value || {};
      (req as any).value.body = parsedData;

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: err.errors.map((e) => e.message), // Extract error messages
        });
      }
      next(err);
    }
  };
};