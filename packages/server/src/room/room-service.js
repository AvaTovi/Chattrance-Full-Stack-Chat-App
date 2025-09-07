import bcrypt from "bcryptjs";

import { SALT_ROUNDS } from "./constants.js";

import { ERROR_CODES } from "./error-code.js";

import * as roomModel from "./room-model.js"

/**
 * 
 * @param {number} userId 
 * @returns {Promise<Array<{ id: number, name: string?, password: string?, owner: number, created: Date }>>}
 */
export async function getRooms(userId) {

  const roomsData = await roomModel.getRoomsByUserId(userId);

  if (!roomsData) {
    return { ok: true, data: { rooms: [] } };
  }

  const { password, ...rooms } = roomsData;

  return { ok: true, data: { rooms } };

}

/**
 * 
 * @param {string} name 
 * @param {string} password 
 * @param {number} owner
 * @returns {Promise<{ ok: boolean, message: string | undefined }>}
 */
export async function createRoom(name, password, owner) {

  const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

  const roomId = await roomModel.create(name, passwordHash, owner);

  if (roomId === null) {
    return { ok: false, message: ERROR_CODES.CREATE_ROOM_FAILED };
  }

  return { ok: true };

}

/**
 * 
 * @param {number} roomId 
 * @param {string} password 
 * @param {number} userId
 * @return {Promise<{ ok: boolean, message: string | undefined }>}
 */
export async function joinRoom(roomId, password, userId) {

  const roomData = await roomModel.getRoomById(roomId);

  if (!roomData) {
    return { ok: false, message: ERROR_CODES.ROOM_NOT_FOUND };
  }

  const { password: passwordHash, ...room } = roomData;

  if (!passwordHash) {

    const success = await roomModel.insertRoomMember(roomId, userId);

    if (!success) {
      return { ok: false, message: ERROR_CODES.JOIN_ROOM_FAILED };
    }

    return { ok: true };

  }

  const isMatch = await bcrypt.compare(password, passwordHash);

  if (!isMatch) {
    return { ok: false, message: ERROR_CODES.INCORRECT_PASSWORD };
  }

  const success = await roomModel.insertRoomMember(roomId, userId);

  if (!success) {
    return { ok: false, message: ERROR_CODES.JOIN_ROOM_FAILED };
  }

  return { ok: true, data: { room } };

}

/**
 * 
 * @param {number} roomId 
 * @param {number} userId 
 * @returns {Promise<{ ok: boolean, message: string | undefined }>}
 */
export async function deleteRoom(roomId, userId) {

  const room = await roomModel.getRoomById(roomId);

  if (!room) {
    return { ok: false, message: ERROR_CODES.ROOM_NOT_FOUND };
  }

  if (userId !== room.owner) {
    return { ok: false, message: ERROR_CODES.INSUFFICIENT_PRIVILEGE }
  }

  const success = await roomModel.deleteRoom(roomId);

  if (!success) {
    return { ok: false, message: ERROR_CODES.DELETE_ROOM_FAILED };
  }

  return { ok: true };

}

/**
 * 
 * @param {number} id 
 * @param {string} name 
 * @param {number} userId 
 * @returns {Promise<{ ok: boolean, message: string | undefined }>}
 */
export async function updateRoomName(id, name, userId) {

  const room = await roomModel.getRoomById(id);

  if (!room) {
    return { ok: false, message: ERROR_CODES.ROOM_NOT_FOUND };
  }

  if (userId !== room.owner) {
    return { ok: false, message: ERROR_CODES.INSUFFICIENT_PRIVILEGE };
  }

  const success = await roomModel.updateName(id, name);

  if (!success) {
    return { ok: false, message: ERROR_CODES.UPDATE_ROOM_NAME_FAILED };
  }

  return { ok: true };

}

/**
 * 
 * @param {number} id 
 * @param {string?} password 
 * @param {number} userId 
 * @returns {Promise<{ ok: boolean, message: string | undefined }>}
 */
export async function updateRoomPassword(id, password, userId) {

  const room = await roomModel.getRoomById(id);

  if (!room) {
    return { ok: false, message: ERROR_CODES.ROOM_NOT_FOUND };
  }

  if (userId !== room.owner) {
    return { ok: false, message: ERROR_CODES.INSUFFICIENT_PRIVILEGE };
  }

  const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

  const success = await roomModel.updatePassword(id, passwordHash);

  if (!success) {
    return { ok: false, message: ERROR_CODES.UPDATE_ROOM_PASSWORD_FAILED };
  }

  return { ok: true };

}