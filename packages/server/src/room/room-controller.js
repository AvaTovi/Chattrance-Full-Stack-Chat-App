import { StatusCodes } from "http-status-codes";

import { apiResponse } from "../utils/common.js";

import { ERROR_CODES } from "./error-code.js";

import * as roomService from "./room-service.js";

const SERVER_ERROR = "SERVER_ERROR";

export async function getRooms(req, res) {

  const user = req.session.user;

  try {

    const rooms = await roomService.getRooms(user.id);

    return res
      .status(StatusCodes.OK)
      .json(apiResponse(true, null, { rooms }));


  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));

  }

}

export async function deleteRoom(req, res) {

  try {

    const roomId = Number(req.body.roomId);
    const userId = Number(req.body.roomId);

    if (
      !Number.isInteger(roomId) || roomId < 0 ||
      !Number.isInteger(userId) || userId < 0
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, "Invalid request"));
    }

    const result = await roomService.deleteRoom(roomId, userId);

    if (!result.ok) {

      if (result.message === ERROR_CODES.ROOM_NOT_FOUND) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(apiResponse(false, "Room not found"));
      } else if (result.message === ERROR_CODES.INSUFFICIENT_PRIVILEGE) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(apiResponse(false, "Insufficient privilege"));
      }

      throw new Error(result.message);

    }

    return res
      .status(StatusCodes.OK)
      .json(apiResponse());


  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));
  }
}

export async function joinRoom(req, res) {

  try {



  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));
  }

}

