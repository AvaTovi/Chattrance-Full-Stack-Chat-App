import { StatusCodes } from "http-status-codes";

import {
  getAllRooms,
  createRoom,
  deleteRoom,
  userIsInRoom
} from "../models/room.js"

/**
 * Creates API response object.
 *
 * @param {boolean} ok - Indicates success or failure
 * @param {string?} error - Optional error message
 * @param {*} data - Optional data payload
 * @returns {{ ok: boolean, error: string?, data: * }} API response object
 */
function apiResponse(ok = true, error = null, data = {}) {
  return {
    ok,
    error,
    data
  };
}

export async function getRooms(req, res) {

  const user = req.session.user;

  try {

    const allRooms = getAllRooms(user.id);

    if (allRooms) {
      return res
        .status(StatusCodes.OK)
        .json(apiResponse(true, null, allRooms));
    }

    return res
      .status(StatusCodes.OK)
      .json(apiResponse(true));

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, "Failed to fetch rooms"));

  }

}

export async function deleteRoom(req, res) {

  const { id } = req.body;



}