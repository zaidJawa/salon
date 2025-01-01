import { Request, Response, NextFunction } from "express";

// Define a custom error interface
interface CustomError extends Error {
  status?: number;
}

// Error handling middleware
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorStatus = err.status || 500; // Default to 500 if no status is provided
  const errorMessage = err.message || "Something went wrong!"; // Default message

  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack, // Hide stack trace in production
  });
};

export default errorHandler;
