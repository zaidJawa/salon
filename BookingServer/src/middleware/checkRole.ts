import { Request, Response, NextFunction } from "express";

// Define the user interface based on the decoded JWT payload (from the authenticate middleware)
interface DecodedUser {
  userId: string;
  role: string;
}

interface RequestWithUser extends Request {
  user?: DecodedUser; // Make sure user is defined if it exists
}

export const checkRole = (roles: string | string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    // Check if user exists, and if their role matches the required role or any role in the provided array
    if (
      !req.user ||
      (Array.isArray(roles)
        ? !roles.includes(req.user.role)
        : req.user.role !== roles)
    ) {
      res.status(403).json({
        message: "Forbidden: You don't have the required permissions.",
      });
      return; // Ensure to return to stop further execution
    }

    // Proceed to the next middleware or route handler
    next();
  };
};
