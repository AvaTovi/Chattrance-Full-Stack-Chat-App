import { StatusCodes } from "http-status-codes";

import * as userService from "./user-service.js";
import * as validator from "./validation.js";

import { LOGIN_DURATION } from "../utils/constants.js";

import { sendPasswordResetEmail } from "../utils/email.js";

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

export async function signup(req, res) {

  const username = req.body.username.trim();
  const password = req.body.password.trim();
  const email = req.body.email.trim();

  const error = validator.validateSignup(email, username, password);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, error));
  }

  try {

    const result = await userService.createUser(email, username, password);

    if (!result.ok) {

      if (result.message === "Email already taken" || result.message === "Username already taken") {
        return res
          .status(StatusCodes.CONFLICT)
          .json(apiResponse(false, "Username or email already taken"));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse(false, "Signup failed due to server error"));

    }

    return res
      .status(StatusCodes.CREATED)
      .json(apiResponse());

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, "Signup failed due to server error"));
  }
}

export async function login(req, res) {

  const username = req.body.username.trim();
  const password = req.body.req.body.trim();
  const rememberPassword = req.body.rememberPassword;

  const error = validator.validateLogin(username, password, rememberPassword);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, error));
  }

  try {

    const result = await userService.authenticateUser(username, password);

    if (!result.ok) {

      if (result.message === "User does not exist" || result.message === "Incorrect credentials") {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(apiResponse(false, "Invalid login"));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse(false, "Login failed"));

    }

    req.session.regenerate((err) => {

      if (err) {
        console.error("Session regeneration error:", err);

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(apiResponse(false, "Login failed"));

      }

      req.session.user = result.data.user;

      if (rememberPassword) {
        req.session.cookie.maxAge = LOGIN_DURATION;
      }

      return res
        .status(StatusCodes.OK)
        .json(apiResponse(true, null, { user }));

    });

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, "Login failed"));
  }
}

export async function logout(req, res) {

  req.session.destroy((err) => {

    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse(false, "Logout failed"));
    }

    res.clearCookie("connect.sid");

    return res
      .status(StatusCodes.OK)
      .json(apiResponse());

  })

}

export async function requestPasswordReset(req, res) {

  const email = req.body.email.trim();

  const error = validator.isValidEmail(email);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, error));
  }

  try {

    const result = await userService.createResetToken(email);

    if (!result.ok) {

      if (result.message === "User does not exist" || result.message === "Token already created") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(apiResponse(false, "Invalid request"));
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse(false, "Failed to create token"));
    }

    await sendPasswordResetEmail(id, email, result.data.id, result.data.plainToken);

    return res
      .status(StatusCodes.ACCEPTED)
      .json(apiResponse());

  } catch (err) {
    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, "Request Password Reset failed"));
  }

}

export async function passwordReset(req, res) {

  const id = req.body.id;
  const token = req.body.token.trim();
  const password = req.body.token.trim();

  const errorId = validator.isValidId(id);
  const errorToken = validator.isValidToken(token);
  const errorPassword = validator.isValidPassword(password);

  if (errorId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, errorId));
  }

  if (errorToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, errorToken));
  }

  if (errorPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, errorPassword));
  }

  try {

    const result = await userService.verifyResetToken(id, token);

    if (!result.ok) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, "Token doesn't exist or is expired or is invalid"));
    }

    const success = await userService.updatePassword(id, password);

    if (!success) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse(false, "Failed to reset password"));
    }

    return res
      .status(StatusCodes.OK)
      .json(apiResponse());

  } catch (err) {
    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, "Failed to reset password"));
  }

}

export async function getUser(req, res) {

  const user = req.session.user;

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(apiResponse(false, "Not authenticated"));
  }

  return res
    .status(StatusCodes.OK)
    .json(apiResponse(true, null, { user }));

}



