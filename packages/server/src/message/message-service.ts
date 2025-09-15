import type { ServiceResponse } from '../utils/common.js';

import User from '../user/user-model.js';
import Room from '../room/room-model.js';
import Message from './message-model.js';

import { ERROR_CODES } from './error-code.js';
import { createServiceResponse } from '../utils/common.js';

type MessageData = {
  id: string,
  roomId: string,
  userId: string,
  username: string,
  content: string,
  created: Date
};

export async function getMessages(roomId: string, userId: string): Promise<ServiceResponse<{ messagesData?: MessageData[] }>> {


  const room = await Room.findById(roomId).lean();

  if (!room) {
    return createServiceResponse(false, ERROR_CODES.ROOM_NOT_FOUND);
  }

  const user = User.findById(userId).lean();

  if (!user) {
    return createServiceResponse(false, ERROR_CODES.USER_NOT_FOUND);
  }

  const index = room.members.findIndex(member => member.toString() === userId);

  if (room.owner.toString() !== userId && index === -1) {
    return createServiceResponse(false, ERROR_CODES.USER_NOT_IN_ROOM);
  }

  const messages = await Message.find({ roomId }).lean();

  const messagesData = messages.map(message => {
    return {
      id: message._id.toString(),
      roomId: message.roomId.toString(),
      userId: message.userId.toString(),
      username: message.username,
      content: message.content,
      created: message.created
    } as const;
  });

  return createServiceResponse(true, null, { messagesData });
}

export async function createMessage(roomId: string, userId: string, content: string): Promise<ServiceResponse<{ messageData?: MessageData }>> {

  const room = await Room.findById(roomId).lean();

  if (!room) {
    return createServiceResponse(false, ERROR_CODES.ROOM_NOT_FOUND);
  }

  const user = await User.findById(userId).lean();

  if (!user) {
    return createServiceResponse(false, ERROR_CODES.USER_NOT_FOUND);
  }

  const message = await Message.create({
    roomId,
    userId,
    username: user.name,
    content
  });

  const messageData: MessageData = {
    id: message._id.toString(),
    roomId: message.roomId.toString(),
    userId: message.userId.toString(),
    username: message.username,
    content: message.content,
    created: message.created
  } as const;

  return createServiceResponse(true, null, { messageData });

}

export async function deleteMessage(messageId: string): Promise<ServiceResponse<void>> {

  await Message.findByIdAndDelete(messageId);

  return createServiceResponse(true);

}