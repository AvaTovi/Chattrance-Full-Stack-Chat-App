import util from "util";

import { StatusCodes } from "http-status-codes";

import { apiResponse } from "../utils/common.js";
import { ERROR_CODES } from "./error-codes.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { SESSION_LIFETIME, SESSION_LIFETIME_EXTENDED } from "./constants.js";

import * as userService from "./user-service.js";

import * as validator from "./validation.js";

const SERVER_ERROR = "SERVER ERROR";

export async function signup(req, res) {

  try {

    if (typeof req.body.username !== "string" || typeof req.body.password !== "string" || typeof req.body.email !== "string") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, "Invalid types"));
    }

    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const email = req.body.email.trim();

    const error = validator.validateSignup(email, username, password);

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, error));
    }

    const result = await userService.createUser(email, username, password);

    if (!result.ok) {

      if (result.message === ERROR_CODES.EMAIL_TAKEN || result.message === ERROR_CODES.USERNAME_TAKEN) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(apiResponse(false, "Username or email already taken"));
      }

      throw new Error(result.message);

    }

    return res
      .status(StatusCodes.CREATED)
      .json(apiResponse());

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));
  }
}

export async function login(req, res) {

  const regenerateSession = util.promisify(req.session.regenerate).bind(req.session);

  try {

    if (typeof req.body.username !== "string" || typeof req.body.password !== "string" || typeof req.body.rememberMe !== "boolean") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, "Body request not correct"));
    }

    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const rememberMe = req.body.rememberMe;

    const error = validator.validateLogin(username, password);

    if (error) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(apiResponse(false, error));
    }

    const result = await userService.authenticateUser(username, password);

    if (!result.ok) {

      if (result.message === ERROR_CODES.USER_NOT_FOUND || result.message === ERROR_CODES.INCORRECT_PASSWORD) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(apiResponse(false, "Invalid login"));
      }

      throw new Error(result.message);

    }

    await regenerateSession();

    req.session.user = result.data.user;

    if (rememberMe) {
      req.session.cookie.maxAge = SESSION_LIFETIME_EXTENDED;
    } else {
      req.session.cookie.maxAge = SESSION_LIFETIME;
    }

    return res
      .status(StatusCodes.OK)
      .json(apiResponse(true, null, { user: result.data.user }));

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));
  }
}

export async function logout(req, res) {

  const destroySession = util.promisify(req.session.destroy).bind(req.session);

  try {

    await destroySession();

    res.clearCookie("connect.sid");

    return res.status(StatusCodes.OK).json(apiResponse());

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));

  }

}

export async function requestPasswordReset(req, res) {

  const genericMessage = "If an account is associated with this email, a message will be sent.";

  try {

    if (typeof req.body.email !== "string") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, "Invalid types"));
    }

    const email = req.body.email.trim();

    const error = validator.isValidEmail(email);

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, error));
    }

    const result = await userService.createResetToken(email);

    if (!result.ok) {

      if (result.message === ERROR_CODES.USER_NOT_FOUND || result.message === ERROR_CODES.TOKENS_ALREADY_EXIST) {
        return res
          .status(StatusCodes.OK)
          .json(apiResponse(true, null, genericMessage));
      }

      throw new Error(result.message);
    }

    await sendPasswordResetEmail(id, email, result.data.id, result.data.plainToken);

    return res
      .status(StatusCodes.OK)
      .json(apiResponse(true, null, genericMessage));

  } catch (err) {

    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));
  }

}

export async function passwordReset(req, res) {

  try {

    const userId = Number(req.body.id);

    if (
      !Number.isInteger(userId) ||
      userId < 0 ||
      typeof req.body.token !== "string" ||
      typeof req.body.password !== "string"
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(apiResponse(false, "Invalid types"));
    }

    const token = req.body.token.trim();
    const password = req.body.token.trim();

    const errorPassword = validator.isValidPassword(password);

    if (errorPassword) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(apiResponse(false, errorPassword));
    }

    let result = await userService.verifyResetToken(userId, token);

    if (!result.ok) {

      if (result.message === ERROR_CODES.NO_TOKENS_FOUND || result.message === ERROR_CODES.INVALID_TOKEN) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(apiResponse(false, "Token invalid or expired or does not exist"));
      }

      throw new Error(result.message);
    }

    result = await userService.updatePassword(userId, password);

    if (!result.ok) {
      throw new Error(result.message);
    }

    return res
      .status(StatusCodes.OK)
      .json(apiResponse());

  } catch (err) {
    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));
  }

}

export async function getUser(req, res) {

  try {

    const user = req.session.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(apiResponse(false, "Not authenticated"));
    }

    return res
      .status(StatusCodes.OK)
      .json(apiResponse(true, null, { user }));

  } catch (err) {
    console.error(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(apiResponse(false, SERVER_ERROR));
  }

}



