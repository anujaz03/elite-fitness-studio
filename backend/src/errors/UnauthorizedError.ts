import { AppError } from './AppError';
import { STATUS_CODES, StatusCode } from '../constants/statusCodes';
import { ERROR_CODES, ErrorCode } from '../constants/errorCodes';

export class UnauthorizedError extends AppError {
  public readonly statusCode: StatusCode = STATUS_CODES.UNAUTHORIZED;
  public readonly errorCode: ErrorCode = ERROR_CODES.UNAUTHORIZED;

  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}
