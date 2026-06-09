const crypto = require("crypto");
const { createLogger } = require("./logger");

function getRequestId(req) {
  return (
    req.headers?.["x-request-id"] ||
    req.headers?.["x-correlation-id"] ||
    crypto.randomUUID()
  );
}


