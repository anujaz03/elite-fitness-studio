import { Response } from 'express';
import { StatusCode, STATUS_CODES } from '../constants/statusCodes';
import { ErrorCode, ERROR_CODES } from '../constants/errorCodes';

export interface ISuccessResponse<T> {
  success: true;
  message?: string;
  data?: T;
}

export interface IErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

export class ResponseHelper {
  public static sendSuccess<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: StatusCode = STATUS_CODES.OK
  ): Response {
    const responseBody: ISuccessResponse<T> = {
      success: true,
      message,
      data
    };
    return res.status(statusCode).json(responseBody);
  }

  public static sendError(
    res: Response,
    message: string,
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    statusCode: StatusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
    details?: any
  ): Response {
    const responseBody: IErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details
      }
    };
    return res.status(statusCode).json(responseBody);
  }
}
