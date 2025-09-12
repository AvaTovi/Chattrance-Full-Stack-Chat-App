import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ACTIVE_TOKENS, SALT_ROUNDS, TOKEN_LIFETIME, TOKEN_SIZE } from "./constants.js";
import { createServiceResponse } from "../utils/common.js";
import User from "./user-model.js";
import ResetToken from "./reset-token-model.js";
import { ERROR_CODES } from "./error-codes.js";
;
;
export async function createUser(email, name, password) {
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
        return createServiceResponse(false, ERROR_CODES.USER_ALREADY_EXIST);
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({
        email,
        name,
        password: passwordHash
    });
    const savedUser = await newUser.save();
    const userData = {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
        created: savedUser.created
    };
    return createServiceResponse(true, null, { userData: userData });
}
export async function authenticateUser(username, password) {
    const user = await User.findOne({ name: username });
    if (!user) {
        return createServiceResponse(false, ERROR_CODES.USER_NOT_FOUND);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return createServiceResponse(false, ERROR_CODES.INCORRECT_PASSWORD);
    }
    const userData = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        created: user.created
    };
    return createServiceResponse(true, null, { userData });
}
export async function updatePassword(userId, password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await User.findByIdAndUpdate(userId, { password: passwordHash }, { new: true });
    if (!result) {
        return createServiceResponse(false, ERROR_CODES.UPDATE_PASSWORD_FAILED);
    }
    return createServiceResponse(true);
}
export async function createResetToken(email) {
    const user = await User.findOne({ email });
    if (!user) {
        return createServiceResponse(false, ERROR_CODES.USER_NOT_FOUND);
    }
    const userId = user._id.toString();
    const resetTokens = await ResetToken.find({ userId });
    if (resetTokens) {
        const currentTime = new Date();
        const validTokens = resetTokens.filter(entry => currentTime < entry.expires);
        if (validTokens.length >= ACTIVE_TOKENS) {
            return createServiceResponse(false, ERROR_CODES.TOKENS_ALREADY_EXIST);
        }
    }
    const plainToken = crypto.randomBytes(TOKEN_SIZE).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(plainToken).digest("hex");
    const expires = new Date(Date.now() + TOKEN_LIFETIME);
    const resetToken = new ResetToken({
        tokenHash,
        userId,
        expires,
    });
    await resetToken.save();
    return createServiceResponse(false, null, { userId, plainToken });
}
export async function verifyResetToken(userId, plainToken) {
    const resetTokens = await ResetToken.find({ userId });
    if (resetTokens.length === 0) {
        return createServiceResponse(false, ERROR_CODES.NO_TOKENS_FOUND);
    }
    const currentTime = new Date();
    const validTokens = resetTokens.filter(entry => currentTime < entry.expires);
    if (validTokens.length === 0) {
        return createServiceResponse(false, ERROR_CODES.NO_VALID_TOKENS_FOUND);
    }
    const tokenHash = crypto.createHash("sha256").update(plainToken).digest("hex");
    const oneMatch = validTokens.find(entry => tokenHash === entry.token);
    if (!oneMatch) {
        return createServiceResponse(false, ERROR_CODES.INVALID_TOKEN);
        ;
    }
    const result = await ResetToken.deleteMany({ userId });
    if (result.deletedCount === 0) {
        return createServiceResponse(false, ERROR_CODES.DELETE_TOKEN_FAILED);
    }
    return createServiceResponse(true);
}
//# sourceMappingURL=user-service.js.map