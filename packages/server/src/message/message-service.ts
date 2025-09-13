import type { ServiceResponse } from '../utils/common.js';
import * as messageModel from './message-model.js';

type MessageData = {
  id: string,
  roomId: string,
  userId: string,
  content: string,
  created: Date
};

async function getMessage(roomId: number, userId: number): Promise<ServiceResponse<{ messageData: MessageData[] }>> {





}