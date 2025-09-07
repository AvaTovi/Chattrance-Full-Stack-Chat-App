/**
 * Creates API response object.
 *
 * @param {boolean} ok - Indicates success or failure
 * @param {string?} error - Optional error message
 * @param {*} data - Optional data payload
 * @returns {{ ok: boolean, error: string?, data: * }} API response object
 */
export function apiResponse(ok = true, error = null, data = {}) {
  return {
    ok,
    error,
    data
  };
}

export function requireJSON(req, res, next) {

  const contentType = req.headers["content-type"] ?? "";

  if (!contentType.includes("application/json")) {
    return res
      .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
      .json(apiResponse(false, "Content-Type must be application/json"));
  }

  if (!req.body) {
    return res
      .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
      .json(apiResponse(false, "Request body missing"));
  }

  next();

}