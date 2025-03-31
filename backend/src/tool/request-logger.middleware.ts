import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as mongoose from 'mongoose'
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor() {
    // Enable Mongoose Debugging
    mongoose.set('debug', (collectionName, method, query, rawResponse) => {
      this.logger.log(`📦 [MongoDB] ${collectionName}.${method} - Query: ${JSON.stringify(query)}`);
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body } = req;
    const start = Date.now();

    this.logger.log(`📥 [Request] ${method} ${originalUrl}`);

    // Capture Response Data
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: any[] = [];

    res.write = function (chunk: any) {
      chunks.push(chunk);
      return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk: any) {
      if (chunk) chunks.push(chunk);

      const responseBody = Buffer.concat(chunks).toString('utf8');
      const duration = Date.now() - start;

      this.logger.log(`📤 [Response] ${method} ${originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);

      oldEnd.apply(res, arguments);
    }.bind(this);

    next();
  }
}
