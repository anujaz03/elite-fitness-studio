import { AppError } from './AppError';
import { STATUS_CODES, StatusCode } from '../constants/statusCodes';
import { ERROR_CODES, ErrorCode } from '../constants/errorCodes';

export class ConflictError extends AppError {
  public readonly statusCode: StatusCode = STATUS_CODES.CONFLICT;
  public readonly errorCode: ErrorCode = ERROR_CODES.CONFLICT_ERROR;

  constructor(message: string) {
    super(message);
  }
}
