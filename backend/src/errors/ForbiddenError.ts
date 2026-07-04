import { AppError } from './AppError';
import { STATUS_CODES, StatusCode } from '../constants/statusCodes';
import { ERROR_CODES, ErrorCode } from '../constants/errorCodes';

export class ForbiddenError extends AppError {
  public readonly statusCode: StatusCode = STATUS_CODES.FORBIDDEN;
  public readonly errorCode: ErrorCode = ERROR_CODES.FORBIDDEN;

  constructor(message: string = 'Forbidden access') {
    super(message);
  }
}
