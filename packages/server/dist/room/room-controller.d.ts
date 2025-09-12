import type { Request, Response } from "express";
/**
 * @typedef {Object} User
 * @property {number} id - The unique identifier for the user.
 * @property {string} email - The email address of the user.
 * @property {string} name - The name of the user.
 * @property {Date} created - The date when the user was created.
 */
export declare function getRooms(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createRoom(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteRoom(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function joinRoom(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=room-controller.d.ts.map