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
    GET_MESSAGES: '/api/rooms/:roomId',
    DELETE_ROOMS: '/api/delete-room',
    CREATE_ROOMS: '/api/create-room',
    JOIN_ROOM: '/api/join-room',
  }
}