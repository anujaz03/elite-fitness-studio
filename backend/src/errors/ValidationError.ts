import { AppError } from './AppError';
import { STATUS_CODES, StatusCode } from '../constants/statusCodes';
import { ERROR_CODES, ErrorCode } from '../constants/errorCodes';

export class ValidationError extends AppError {
  public readonly statusCode: StatusCode = STATUS_CODES.BAD_REQUEST;
  public readonly errorCode: ErrorCode = ERROR_CODES.VALIDATION_ERROR;
  public readonly details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.details = details;
  }
}
