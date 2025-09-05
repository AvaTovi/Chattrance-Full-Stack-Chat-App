// packages/shared/api-routes.js

export const BASE_API = "/api";

export const API_ROUTES = {

  AUTH: {
    SIGNUP: `${BASE_API}/auth/signup`,
    LOGIN: `${BASE_API}/auth/login`,
    LOGOUT: `${BASE_API}/auth/logout`,
    REQUEST_RESET_PASSWORD: `${BASE_API}/auth/request-reset`,
    RESET_PASSWORD: `${BASE_API}/auth/password-reset`,
  },
  USER: {
    GET_USER: `${BASE_API}/user`,
    CHANGE_PASSWORD: `${BASE_API}/change-password`
  },
  CHAT: {
    GET_ROOMS: `${BASE_API}/rooms`
  }
}