import { StatusCodes } from "http-status-codes";
import { createApiResponse } from "../utils/common.js";
import { ERROR_CODES } from "./error-code.js";
import * as roomService from "./room-service.js";
const BAD_REQUEST = "BAD REQUEST";
const SERVER_ERROR = "SERVER ERROR";
/**
 * @typedef {Object} User
 * @property {number} id - The unique identifier for the user.
 * @property {string} email - The email address of the user.
 * @property {string} name - The name of the user.
 * @property {Date} created - The date when the user was created.
 */
export async function getRooms(req, res) {
    try {
        const user = req.session.user;
        if (!user) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(createApiResponse(false, "Must be logged in"));
        }
        const { rooms } = await roomService.getRooms(user.id);
        console.log(createApiResponse(true, null, { rooms }));
        return res
            .status(StatusCodes.OK)
            .json(createApiResponse(true, null, { rooms }));
    }
    catch (err) {
        console.error(err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createApiResponse(false, SERVER_ERROR));
    }
}
export async function createRoom(req, res) {
    try {
        const user = req.session.user;
        if (!user) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(createApiResponse(false, "Must be logged in"));
        }
        if (typeof req.body.roomName !== "string" || typeof req.body.roomPassword !== "string") {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createApiResponse(false, BAD_REQUEST));
        }
        const roomName = req.body.roomName.trim();
        const roomPassword = req.body.roomPassword.trim();
        const result = await roomService.createRoom(roomName, roomPassword, user.id);
        if (!result.ok) {
            throw new Error(result.message);
        }
        return res
            .status(StatusCodes.OK)
            .json(createApiResponse(true));
    }
    catch (err) {
        console.error(err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createApiResponse(false, SERVER_ERROR));
    }
}
export async function deleteRoom(req, res) {
    try {
        const user = req.session.user;
        if (!user) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(createApiResponse(false, "Must be logged in"));
        }
        const roomId = Number(req.query["room-id"]);
        if (!Number.isInteger(roomId) || roomId < 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createApiResponse(false, BAD_REQUEST));
        }
        const result = await roomService.deleteRoom(roomId, user.id);
        if (!result.ok) {
            if (result.message === ERROR_CODES.ROOM_NOT_FOUND) {
                return res
                    .status(StatusCodes.UNPROCESSABLE_ENTITY)
                    .json(createApiResponse(false, "Room not found"));
            }
            else if (result.message === ERROR_CODES.INSUFFICIENT_PRIVILEGE) {
                return res
                    .status(StatusCodes.UNPROCESSABLE_ENTITY)
                    .json(createApiResponse(false, "Insufficient privilege"));
            }
            throw new Error(result.message);
        }
        return res
            .status(StatusCodes.OK)
            .json(createApiResponse(true));
    }
    catch (err) {
        console.error(err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createApiResponse(false, SERVER_ERROR));
    }
}
export async function joinRoom(req, res) {
    try {
        const user = req.session.user;
        if (!user) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(createApiResponse(false, "Must be logged in"));
        }
        const roomId = Number(req.query["room-id"]);
        if (!Number.isInteger(roomId) || roomId < 0 ||
            typeof req.body.password !== "string") {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createApiResponse(false, BAD_REQUEST));
        }
        const roomPassword = req.body.password.trim();
        const result = await roomService.joinRoom(roomId, roomPassword, user.id);
        if (!result.ok) {
            if (result.message === ERROR_CODES.ROOM_NOT_FOUND) {
                return res
                    .status(StatusCodes.UNPROCESSABLE_ENTITY)
                    .json(createApiResponse(false, "Room not found"));
            }
            else if (result.message === ERROR_CODES.INCORRECT_PASSWORD) {
                return res
                    .status(StatusCodes.UNPROCESSABLE_ENTITY)
                    .json(createApiResponse(false, "Incorrect password"));
            }
            throw new Error(result.message);
        }
    }
    catch (err) {
        console.error(err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createApiResponse(false, SERVER_ERROR));
    }
}
//# sourceMappingURL=room-controller.js.map