import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';
import cmsRouter from './routes/cmsRoutes';
import programRouter from './routes/programRoutes';
import classRouter from './routes/classRoutes';
import bookingRouter from './routes/bookingRoutes';
import paymentRouter from './routes/paymentRoutes';
import userRouter from './routes/userRoutes';
import trainerRouter from './routes/trainerRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger Middleware
app.use(morgan('dev'));

// Rate Limiters Configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_AUTH_ATTEMPTS',
      message: 'Too many auth requests from this IP, please try again after 15 minutes.'
    }
  }
});

// Apply rate limiters
app.use('/api/v1', generalLimiter);
app.use('/api/v1/auth', authLimiter);

// Mount API Routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/trainers', trainerRouter);
app.use('/api/v1', cmsRouter);

// Basic health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

import { errorMiddleware } from './middleware/errorMiddleware';

// Centralized Error Handler
app.use(errorMiddleware);

// Start Express Server
app.listen(PORT, () => {
  console.log(`[Server]: EliteFit Express API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
export default app;
