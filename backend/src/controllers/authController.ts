import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/authValidators';

const JWT_SECRET = process.env.JWT_SECRET || 'temporary_development_jwt_secret_key_123!';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '86400';

const signToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: Number(JWT_EXPIRY)
  });
};

const sendTokenCookie = (res: Response, token: string) => {
  const expiryDays = Number(JWT_EXPIRY) / (24 * 3600);
  res.cookie('token', token, {
    expires: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validation
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Registration inputs invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { firstName, lastName, email, password, phone } = parsed.data;

    // 2. Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email address already exists.'
        }
      });
      return;
    }

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 5. Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      verificationToken,
      role: 'member',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. A verification email has been sent.',
      data: {
        userId: newUser._id,
        email: newUser.email,
        verificationToken // Returned for easy testing in development
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: (error as Error).message || 'An error occurred during registration.'
      }
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validation
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Login credentials invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { email, password } = parsed.data;

    // 2. User credentials check
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Incorrect email address or password.'
        }
      });
      return;
    }

    // 3. User active check
    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: `Your account status is ${user.status}. Please contact support.`
        }
      });
      return;
    }

    // 4. Issue token and Cookie
    const token = signToken(user._id.toString());
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: (error as Error).message || 'An error occurred during login.'
      }
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.cookie('token', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({
      success: true,
      message: 'Logout successful.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_FAILED',
        message: 'An error occurred during logout.'
      }
    });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Verification token must be provided.'
        }
      });
      return;
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Verification token is invalid or expired.'
        }
      });
      return;
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: 'An error occurred during email verification.'
      }
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User session not found.'
        }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {
        userId: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        status: req.user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SESSION_CHECK_FAILED',
        message: 'An error occurred fetching user metadata.'
      }
    });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email input invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { email } = parsed.data;
    const user = await User.findOne({ email });

    if (!user) {
      // In production, we say check email box even if user doesn't exist for security.
      // But for testing simplicity, we can do a mock success response.
      res.status(200).json({
        success: true,
        message: 'If an account exists, a password reset link has been dispatched.'
      });
      return;
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 Hour

    await user.save();

    res.status(200).json({
      success: true,
      message: 'If an account exists, a password reset link has been dispatched.',
      data: {
        resetToken // Returned in body for easy testing/simulation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FORGOT_PASSWORD_FAILED',
        message: 'An error occurred during the password reset request.'
      }
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const parsed = resetPasswordSchema.safeParse(req.body);
    
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password input invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { password } = parsed.data;
    
    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OR_EXPIRED_TOKEN',
          message: 'Password reset token is invalid or has expired.'
        }
      });
      return;
    }

    // Save new hashed password
    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(password, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'RESET_PASSWORD_FAILED',
        message: 'An error occurred during password reset.'
      }
    });
  }
};
