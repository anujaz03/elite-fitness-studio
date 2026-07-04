import { Response } from 'express';
import { ResponseHelper } from '../helpers/responseHelper';
import { StatusCode, STATUS_CODES } from '../constants/statusCodes';
import { ErrorCode, ERROR_CODES } from '../constants/errorCodes';

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: StatusCode = STATUS_CODES.OK
  ): Response {
    return ResponseHelper.sendSuccess(res, data, message, statusCode);
  }

  protected sendError(
    res: Response,
    message: string,
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    statusCode: StatusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
    details?: any
  ): Response {
    return ResponseHelper.sendError(res, message, code, statusCode, details);
  }
}
