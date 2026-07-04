import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ForbiddenError } from '../errors/ForbiddenError';

export const protect = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Extract token from Cookie Header
    if (req.headers.cookie) {
      const cookieToken = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('token='));
      if (cookieToken) {
        token = cookieToken.split('=')[1];
      }
    }

    // 2. Fallback check for Authorization Bearer Header (for development testing)
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('You are not logged in. Please log in to access this resource.');
    }

    // 3. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'temporary_development_jwt_secret_key_123!') as {
      id: string;
    };

    // 4. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    // 5. Check if user is active
    if (currentUser.status !== 'active') {
      throw new ForbiddenError(`Your account is currently ${currentUser.status}. Please contact support.`);
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new UnauthorizedError('Your token is invalid or expired. Please log in again.'));
    }
  }
};

export const restrictTo = (...roles: ('guest' | 'member' | 'trainer' | 'admin' | 'super-admin')[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ForbiddenError('You do not have permission to perform this action.'));
      return;
    }
    next();
  };
};

export default { protect, restrictTo };

