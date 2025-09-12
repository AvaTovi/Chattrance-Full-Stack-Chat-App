import { type Request, type Response } from 'express';
export declare function signup(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function requestPasswordReset(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function passwordReset(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user-controller.d.ts.map