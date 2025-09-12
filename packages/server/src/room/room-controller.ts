import type { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import { createApiResponse, type ApiResponse } from "../utils/common.js";

import { ERROR_CODES } from "./error-code.js";

import * as roomService from "./room-service.js";

import type { RoomData } from "./room-service.js";

import type { UserData } from "../user/user-service.js";

const BAD_REQUEST = "BAD REQUEST";
const SERVER_ERROR = "SERVER ERROR";

export async function getRooms(req: Request, res: Response) {

  try {

    const user = req.session.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createApiResponse(false, "Must be logged in"));
    }

    const rooms = await roomService.getRooms(user.id);

    return res
      .status(StatusCodes.OK)
      .json(createApiResponse(true, null, { rooms }));

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createApiResponse(false, SERVER_ERROR));

  }

}

export async function createRoom(req: Request, res: Response) {

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

    const roomName: string = req.body.roomName.trim();
    const roomPassword: string = req.body.roomPassword.trim();

    const result = await roomService.createRoom(roomName, roomPassword, user.id);

    if (!result.ok) {
      throw new Error(result.error ?? "Unknown error");
    }

    return res
      .status(StatusCodes.OK)
      .json(createApiResponse(true));

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createApiResponse(false, SERVER_ERROR));
  }

}

export async function deleteRoom(req: Request, res: Response) {

  try {

    const user = req.session.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createApiResponse(false, "Must be logged in"));
    }

    if (typeof req.query['room-id'] !== "string") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createApiResponse(false, BAD_REQUEST));
    }

    const roomId: string = req.query['room-id'];

    const result = await roomService.deleteRoom(roomId, user.id);

    if (!result.ok) {

      if (result.error === ERROR_CODES.ROOM_NOT_FOUND) {
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json(createApiResponse(false, "Room not found"));
      } else if (result.error === ERROR_CODES.INSUFFICIENT_PRIVILEGE) {
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json(createApiResponse(false, "Insufficient privilege"));
      }

      throw new Error(result.error ?? "Unknown error");

    }

    return res
      .status(StatusCodes.OK)
      .json(createApiResponse(true));


  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createApiResponse(false, SERVER_ERROR));
  }
}

export async function joinRoom(req: Request, res: Response) {

  try {

    const user = req.session.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createApiResponse(false, "Must be logged in"));
    }

    const roomId = Number(req.query["room-id"]);

    if (
      !Number.isInteger(roomId) || roomId < 0 ||
      typeof req.body.password !== "string"
    ) {
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
      } else if (result.message === ERROR_CODES.INCORRECT_PASSWORD) {
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json(createApiResponse(false, "Incorrect password"));
      }

      throw new Error(result.message);

    }

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createApiResponse(false, SERVER_ERROR));
  }

}

