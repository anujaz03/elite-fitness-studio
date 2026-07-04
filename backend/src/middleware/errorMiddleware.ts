import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ResponseHelper } from '../helpers/responseHelper';
import { logger } from '../services/LoggerService';
import { STATUS_CODES } from '../constants/statusCodes';
import { ERROR_CODES } from '../constants/errorCodes';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(`Exception intercepted on path ${req.path}:`, err);

  if (err instanceof AppError) {
    ResponseHelper.sendError(
      res,
      err.message,
      err.errorCode,
      err.statusCode,
      (err as any).details
    );
    return;
  }

  // Handle default unhandled exceptions
  ResponseHelper.sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    STATUS_CODES.INTERNAL_SERVER_ERROR
  );
}
