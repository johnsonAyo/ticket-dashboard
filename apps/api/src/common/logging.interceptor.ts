import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type Observable, tap } from 'rxjs';
import { TicketNotFoundError } from '../tickets/domain/ticket-not-found.error';

const SLOW_REQUEST_THRESHOLD_MS = 500;

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Http');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const { method } = request;
    const url = request.originalUrl;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.report(method, url, http.getResponse<Response>().statusCode, startedAt),
        error: (error: unknown) => this.report(method, url, resolveErrorStatus(error), startedAt),
      }),
    );
  }

  private report(method: string, url: string, statusCode: number, startedAt: number): void {
    const durationMs = Date.now() - startedAt;
    const line = `${method} ${url} -> ${statusCode} (${durationMs}ms)`;
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(line);
    } else if (statusCode >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(`${line} [client friction]`);
    } else if (durationMs >= SLOW_REQUEST_THRESHOLD_MS) {
      this.logger.warn(`${line} [slow]`);
    } else {
      this.logger.log(line);
    }
  }
}

function resolveErrorStatus(error: unknown): number {
  if (error instanceof TicketNotFoundError) {
    return HttpStatus.NOT_FOUND;
  }
  if (error instanceof HttpException) {
    return error.getStatus();
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}
