const crypto = require("crypto");
const { createLogger } = require("./logger");

function getRequestId(req) {
  return (
    req.headers?.["x-request-id"] ||
    req.headers?.["x-correlation-id"] ||
    crypto.randomUUID()
  );
}

function createRequestLogger(options = {}) {
  const logger = options.logger || createLogger(options);
  const includeHeaders = options.includeHeaders === true;

  return function requestLogger(req, res, next) {
    const startedAt = process.hrtime.bigint();
    const requestId = getRequestId(req);

    req.requestId = requestId;
    res.setHeader?.("x-request-id", requestId);

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const statusCode = res.statusCode;
      const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

      logger.log(level, "HTTP request completed", {
        requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode,
        durationMs: Math.round(durationMs * 100) / 100,
        ip: req.ip || req.socket?.remoteAddress,
        userAgent: req.headers?.["user-agent"],
        ...(includeHeaders ? { headers: req.headers } : {})
      });
    });

    next();
  };
}

module.exports = {
  createRequestLogger
};
