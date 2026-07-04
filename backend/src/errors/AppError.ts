import { StatusCode } from '../constants/statusCodes';
import { ErrorCode } from '../constants/errorCodes';

export abstract class AppError extends Error {
  public abstract readonly statusCode: StatusCode;
  public abstract readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(message: string, isOperational = true) {
    super(message);
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
