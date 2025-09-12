export interface Room {
    id: number;
    name?: string;
    owner: number;
    created: Date;
    member: number[];
}
export interface ServiceResponse<T = any> {
    ok: boolean;
    message?: string;
    data?: T;
}
/**
 *
 * @param {number} userId
 * @returns {Promise<{ok : boolean, rooms: Array<{id: number, name: string?, owner: number, created: Date, members: Array<number>}>}>}
 */
export declare function getRooms(userId: number): Promise<ServiceResponse<{
    rooms: Room[];
}>>;
export declare function createRoom(username: string, password: string, owner: number): Promise<ServiceResponse>;
/**
 *
 * @param {number} roomId
 * @param {string} password
 * @param {number} userId
 * @return {Promise<{ ok: boolean, message: string | undefined }>}
 */
export declare function joinRoom(roomId: any, password: any, userId: any): Promise<{
    ok: boolean;
    message: string;
    data?: never;
} | {
    ok: boolean;
    message?: never;
    data?: never;
} | {
    ok: boolean;
    data: {
        room: any;
    };
    message?: never;
}>;
export declare function leaveRoom(roomId: number, userId: number): Promise<ServiceResponse>;
/**
 *
 * @param {number} roomId
 * @param {number} userId
 * @returns {Promise<{ ok: boolean, message: string | undefined }>}
 */
export declare function deleteRoom(roomId: any, userId: any): Promise<{
    ok: boolean;
    message: string;
} | {
    ok: boolean;
    message?: never;
}>;
/**
 *
 * @param {number} id
 * @param {string} name
 * @param {number} userId
 * @returns {Promise<{ ok: boolean, message: string | undefined }>}
 */
export declare function updateRoomName(id: any, name: any, userId: any): Promise<{
    ok: boolean;
    message: string;
} | {
    ok: boolean;
    message?: never;
}>;
/**
 *
 * @param {number} id
 * @param {string?} password
 * @param {number} userId
 * @returns {Promise<{ ok: boolean, message: string | undefined }>}
 */
export declare function updateRoomPassword(id: any, password: any, userId: any): Promise<{
    ok: boolean;
    message: string;
} | {
    ok: boolean;
    message?: never;
}>;
//# sourceMappingURL=room-service.d.ts.map