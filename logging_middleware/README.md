# Logging Middleware

Reusable logging middleware for the notification project. It logs structured JSON to the console, optionally writes to a file, and can optionally forward each log entry to a remote logging endpoint.

## Install

No third-party package is required. The middleware uses Node.js 18+ built-ins.

## Express usage

```js
const express = require("express");
const { createLogger, createRequestLogger } = require("../logging_middleware");

const app = express();
const logger = createLogger({
  serviceName: "notification-app-be",
  logFile: "logs/app.log"
});

app.use(createRequestLogger({ logger }));

app.get("/health", (req, res) => {
  logger.info("Health check", { requestId: req.requestId });
  res.json({ ok: true });
});
```

## Configuration

- `SERVICE_NAME`: service name added to every log entry.
- `LOG_LEVEL`: one of `debug`, `info`, `warn`, or `error`.
- `LOG_FILE`: optional file path for JSON-line logs.
- `LOG_REMOTE_URL`: optional remote `POST` endpoint for log forwarding.
- `LOG_REMOTE_TOKEN`: optional bearer token for remote log forwarding.

## Exported API

- `createLogger(options)`: creates a structured logger with `debug`, `info`, `warn`, `error`, and `log` methods.
- `createRequestLogger(options)`: creates Express-compatible middleware that logs method, path, status code, duration, IP, user agent, and request ID.
