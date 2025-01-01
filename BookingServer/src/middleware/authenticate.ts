import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedUser } from "../types";


// Extend the Request interface to include the user object
interface RequestWithUser extends Request {
  user?: DecodedUser;
}

const authenticate = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.accessToken;

  // If no token is provided, return a 401 Unauthorized error
  if (!token) {
    res.status(401).json({
      message: "Access token missing",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN || '') as DecodedUser;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "JWT expired",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    res.status(403).json({
      error: "Invalid token",
    });
  }
};

export default authenticate;
