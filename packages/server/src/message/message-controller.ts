import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { createApiResponse } from '../utils/common.js';

import { ERROR_CODES } from './error-code.js';

import * as messageService from './message-service.js';

const MAX_MESSAGE_SIZE = 500;
const BAD_REQUEST = 'BAD REQUEST';
const SERVER_ERROR = 'SERVER ERROR';

export async function getMessages(req: Request, res: Response) {

  function escapeHTML(input: string): string {
    return input.replace(/[&<>"']/g, (char) => {
      switch (char) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return char;
      }
    });
  }


  try {

    const user = req.session.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createApiResponse(false, 'Must be logged in'));
    }

    if (typeof req.query['room-id'] !== 'string') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createApiResponse(false, BAD_REQUEST));
    }
    const roomId: string = req.query['room-id'];
    const messages = await messageService.getMessages(roomId, user.id);

    if (!messages.ok || !messages.data) {
      if (messages.error === ERROR_CODES.ROOM_NOT_FOUND || messages.error === ERROR_CODES.USER_NOT_FOUND || messages.error === ERROR_CODES.USER_NOT_IN_ROOM) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createApiResponse(false, 'Room not found or user not found or user is not in room'));
      }

      throw new Error(messages.error ?? 'Unknown error');
    }

    return res
      .status(StatusCodes.OK)
      .json(createApiResponse(true, null, { messages: messages.data.messagesData }));

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createApiResponse(false, SERVER_ERROR));

  }

}

export async function createMessage(req: Request, res: Response) {

  try {

    const user = req.session.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createApiResponse(false, 'Must be logged in'));
    }

    if (
      typeof req.query['room-id'] !== 'string' ||
      typeof req.body.content !== 'string'
    ) {
      console.log(req.query);
      console.log(req.body);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createApiResponse(false, BAD_REQUEST));
    }

    const roomId: string = req.query['room-id'];
    const content: string = req.body.content;

    if (content.length > MAX_MESSAGE_SIZE) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(createApiResponse(false, `Message size must not exceed ${MAX_MESSAGE_SIZE} characters`));
    }

    const result = await messageService.createMessage(roomId, user.id, content);

    if (!result.ok) {
      if (result.error === ERROR_CODES.ROOM_NOT_FOUND) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createApiResponse(false, 'Room not found'));
      }

      throw new Error(result.error ?? 'Unknown error');
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

export async function deleteMessage(req: Request, res: Response) {

  try {

    const user = req.session.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createApiResponse(false, 'Must be logged in'));
    }

    if (typeof req.query['message-id'] !== 'string') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createApiResponse(false, BAD_REQUEST));
    }

    const messageId: string = req.query['message-id'];

    const result = await messageService.deleteMessage(messageId);

    if (!result.ok) {
      throw new Error('Unknown error');
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