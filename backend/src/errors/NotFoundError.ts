import { AppError } from './AppError';
import { STATUS_CODES, StatusCode } from '../constants/statusCodes';
import { ERROR_CODES, ErrorCode } from '../constants/errorCodes';

export class NotFoundError extends AppError {
  public readonly statusCode: StatusCode = STATUS_CODES.NOT_FOUND;
  public readonly errorCode: ErrorCode = ERROR_CODES.RESOURCE_NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
