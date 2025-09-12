import type { NextFunction, Request, Response } from "express";
export interface ApiResponse<T = any> {
    ok: boolean;
    error: string | null;
    data: T | null;
}
export interface ServiceResponse<T = any> {
    ok: boolean;
    error: string | null;
    data?: T | null;
}
export declare const createApiResponse: <T>(ok: boolean, error?: string | null, data?: T | null) => ApiResponse<T>;
export declare const createServiceResponse: <T>(ok: boolean, error?: string | null, data?: T | null) => ServiceResponse<T>;
export declare function requireJSON(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=common.d.ts.map