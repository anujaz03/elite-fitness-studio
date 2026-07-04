import { createLogger, format, transports, Logger } from 'winston';

export class LoggerService {
  private static instance: LoggerService;
  private logger: Logger;

  private constructor() {
    this.logger = createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        })
      ]
    });

    if (process.env.NODE_ENV === 'production') {
      this.logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
      this.logger.add(new transports.File({ filename: 'logs/combined.log' }));
    }
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public error(message: string, error?: any): void {
    this.logger.error(message, {
      message: error?.message || error,
      stack: error?.stack,
      ...error
    });
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}

export const logger = LoggerService.getInstance();
