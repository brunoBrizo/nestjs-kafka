import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Response');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime();

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();
      const duration = resTime - reqTime;

      if (statusCode === 200 || statusCode === 201) {
        this.logger.log(`${method} ${url} ${statusCode} - ${duration}ms`);
      }
    });
    next();
  }
}
