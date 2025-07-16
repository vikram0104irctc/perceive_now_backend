import { v4 as uuidv4 } from "uuid";

export function createTracingMiddleware() {
  return async (req, res, next) => {
    const traceId = uuidv4();
    const startTime = Date.now();

    // Add trace ID to request for use in other middlewares/controllers
    req.traceId = traceId;

    // Set header for client traceability
    res.setHeader("X-Trace-Id", traceId);

    // Log initial request
    console.info(
      `[${new Date().toISOString()}] [${traceId}] --> ${req.method} ${
        req.originalUrl
      }`
    );

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const status = res.statusCode;
      const logPrefix = `[${new Date().toISOString()}] [${traceId}]`;

      const message = `${logPrefix} <-- ${req.method} ${req.originalUrl} [${status}] ${duration}ms`;

      if (status >= 500) {
        console.error(message);
      } else if (status >= 400) {
        console.warn(message);
      } else {
        console.info(message);
      }
    });

    next();
  };
}

const tracingMiddleware = createTracingMiddleware();
export default tracingMiddleware;
