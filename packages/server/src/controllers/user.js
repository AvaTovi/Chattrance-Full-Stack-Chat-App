import { StatusCodes } from "http-status-codes";

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