import { StatusCodes } from "http-status-codes";

import {
  authenticateUser,
  createUser,
  isUserTaken,
  findUserByEmail,
  updatePassword
} from "../models/user.js";

import {
  insertResetToken,
  deleteResetToken,
  verifyResetToken
} from "../models/reset-token.js";

import {
  isValidEmail,
  isValidPassword,
  validateLogin,
  validateSignup
} from "../utils/validator.js";

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
  const { username, password, email } = req.body;

  const error = validateSignup(email, username, password);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, error));
  }

  try {
    if (await isUserTaken(email, username)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, "Username or email already taken"));
    }

    const success = await createUser(email, username, password);

    if (success) {
      return res
        .status(StatusCodes.CREATED)
        .json(apiResponse());
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, "Signup failed due to server error"));

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, "Signup failed due to server error"));
  }
}

export async function login(req, res) {
  const { username, password, rememberPassword } = req.body;

  const error = validateLogin(username, password, rememberPassword);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, "Invalid login"));
  }

  try {
    const user = await authenticateUser(username, password);

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(apiResponse(false, "Invalid login"));
    }

    req.session.regenerate((err) => {

      if (err) {
        console.error("Session regeneration error:", err);

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(apiResponse(false, "Login failed"));

      }

      req.session.user = user;

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

  const { email } = req.body;

  const error = isValidEmail(email);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, error));
  }

  try {

    const id = await findUserByEmail(email);

    if (id) {
      const plainToken = await insertResetToken(id);
      if (plainToken) {
        sendPasswordResetEmail(id, email, plainToken);
      }
    }
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

export async function resetPassword(req, res) {

  const { id, password, token } = req.body;

  if (!id || !token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, "Empty request not allowed"));
  }

  const error = isValidPassword(password);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(apiResponse(false, error));
  }

  try {

    const isMatch = await verifyResetToken(id, token);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(apiResponse(false, "Invalid token or expired"));
    }

    await deleteResetToken(id);

    const isUpdated = await updatePassword(id, password);

    if (!isUpdated) {
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



