import jwt from 'jsonwebtoken'
import { DecodedUser } from '../types';

export const generateAccessToken = (user: DecodedUser) => {
  return jwt.sign({
    userId: user.userId,
    role: user.role,
  },
    process.env.ACCESS_SECRET_TOKEN || '', {
    expiresIn: '30d'
  }
  );
};