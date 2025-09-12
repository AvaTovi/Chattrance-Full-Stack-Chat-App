import { type ServiceResponse } from "../utils/common.js";
export interface UserData {
    id: string;
    email: string;
    name: string;
    created: Date;
}
export interface ResetTokenData {
    token: string;
    userId: string;
    expires: Date;
}
export declare function createUser(email: string, name: string, password: string): Promise<ServiceResponse<{
    userData?: UserData;
}>>;
export declare function authenticateUser(username: string, password: string): Promise<ServiceResponse<{
    userData?: UserData;
}>>;
export declare function updatePassword(userId: string, password: string): Promise<ServiceResponse<void>>;
export declare function createResetToken(email: string): Promise<ServiceResponse<{
    userId?: string;
    plainToken?: string;
}>>;
export declare function verifyResetToken(userId: string, plainToken: string): Promise<ServiceResponse<void>>;
//# sourceMappingURL=user-service.d.ts.map