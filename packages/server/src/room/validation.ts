import { MAX_ROOM_NAME } from './constants.js';

export function validName(name: string): string | null {

  if (name === '') {
    return null;
  }

  if (name.length > MAX_ROOM_NAME) {
    return `Room name must be no greater than ${MAX_ROOM_NAME} characters`;
  }

  return null;

}