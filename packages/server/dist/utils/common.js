import { StatusCodes } from "http-status-codes";
;
;
export const createApiResponse = (ok, error = null, data = null) => ({
    ok,
    error,
    data
});
export const createServiceResponse = (ok, error = null, data = null) => ({
    ok,
    error,
    data
});
export function requireJSON(req, res, next) {
    const contentType = req.headers["content-type"] ?? "";
    if (!contentType.includes("application/json")) {
        res
            .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
            .json(createApiResponse(false, "Content-Type must be application/json"));
        return;
    }
    if (!req.body) {
        res
            .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
            .json(createApiResponse(false, "Request must have body"));
        return;
    }
    next();
}
//# sourceMappingURL=common.js.map