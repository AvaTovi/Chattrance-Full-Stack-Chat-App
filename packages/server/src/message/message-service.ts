import type { ServiceResponse } from '../utils/common.js';
import Message from './message-model.js';
import Room from '../room/room-model.js';
import { ERROR_CODES } from './error-code.js';
import { createServiceResponse } from '../utils/common.js';
import User from '../user/user-model.js';
import validator from 'validator';

type MessageData = {
  id: string,
  roomId: string,
  userId: string,
  content: string,
  created: Date
};

async function getMessages(roomId: string, userId: string): Promise<ServiceResponse<{ messagesData?: MessageData[] }>> {


  const room = await Room.findById(roomId).lean();

  if (!room) {
    return createServiceResponse(false, ERROR_CODES.ROOM_NOT_FOUND);
  }

  const user = User.findById(userId).lean();

  if (!user) {
    return createServiceResponse(false, ERROR_CODES.USER_NOT_FOUND);
  }

  if (room.owner.toString() !== userId || !room.members.find(member => member.toString() === userId)) {
    return createServiceResponse(false, ERROR_CODES.USER_NOT_IN_ROOM);
  }

  const messages = await Message.find({ roomId }).lean();

  const messagesData = messages.map(message => {
    return {
      id: message._id.toString(),
      roomId: message.roomId.toString(),
      userId: message.userId.toString(),
      content: validator.escape(message.content),
      created: message.created
    } as const;
  });

  return createServiceResponse(true, null, { messagesData });
}

async function createMessage(roomId: string, userId: string, content: string) {

  const room = await Room.findById(roomId).lean();

  if (!room) {
    return createServiceResponse(false, ERROR_CODES.ROOM_NOT_FOUND);
  }

  const user = User.findById(userId).lean();

  if (!user) {
    return createServiceResponse(false, ERROR_CODES.USER_NOT_FOUND);
  }

  await Message.create({
    roomId,
    userId,
    content
  });

  return createServiceResponse(true);

}