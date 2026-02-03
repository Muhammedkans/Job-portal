import { Request, Response, NextFunction } from 'express';

// Standard Error Interface
interface AppError extends Error {
  statusCode?: number;
}

// 404 Not Found Handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error for server-side debugging (Professional Practice: Use Winston/Datadog here)
  console.error(`[Error] ${err.message}`);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
