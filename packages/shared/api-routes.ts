// packages/shared//api-routes.js
export const API_ROUTES = {

  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REQUEST_RESET_PASSWORD: '/api/auth/request-reset',
    RESET_PASSWORD: '/api/auth/password-reset',
  },
  USER: {
    GET_USER: '/api/user',
    CHANGE_PASSWORD: '/api/change-password'
  },
  CHAT: {
    GET_ROOMS: '/api/rooms',
    DELETE_ROOMS: '/api/delete-room',
    LEAVE_ROOMS: '/api/leave-room',
    CREATE_ROOMS: '/api/create-room',
    JOIN_ROOM: '/api/join-room',
  },
  MESSAGES: {
    GET_MESSAGES: '/api/get-message',
    CREATE_MESSAGE: '/api/create-message',
    DELETE_MESSAGE: '/api/delete-message'
  }
};