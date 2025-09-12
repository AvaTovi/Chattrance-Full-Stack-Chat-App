import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export interface ApiResponse<T = any> {
  ok: boolean,
  error: string | null,
  data: T | null
};

export interface ServiceResponse<T = any> {
  ok: boolean,
  error: string | null,
  data?: T | null
};

export const createApiResponse = <T>(ok: boolean, error: string | null = null, data: T | null = null): ApiResponse<T> => ({
  ok,
  error,
  data
});

export const createServiceResponse = <T>(ok: boolean, error: string | null = null, data: T | null = null): ServiceResponse<T> => ({
  ok,
  error,
  data
});

export function requireJSON(req: Request, res: Response, next: NextFunction): void {

  const contentType = req.headers["content-type"] ?? "";

  if (!contentType.includes("application/json")) {
    res
      .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
      .json(createApiResponse(false, "Content-Type must be application/json"));
    return;
  }

  if (!req.body) {
    res
      .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
      .json(createApiResponse(false, "Request must have body"));
    return;
  }

  next();

}