// Custom Next.js server
// Purpose: wrap the standard Next.js HTTP server so we can suppress
// ECONNRESET / EPIPE noise caused by clients disconnecting mid-upload.
// These are expected events on slow connections — they are not bugs.

const http = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT || "3001", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let server; // Track server reference for graceful shutdown

app.prepare().then(() => {
  server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Suppress ECONNRESET / EPIPE — these fire when a client disconnects
  // before the server finishes responding (e.g. tab closed mid-upload).
  // They are not bugs; logging them floods the output with false alarms.
  server.on("clientError", (err, socket) => {
    if (err.code === "ECONNRESET" || err.code === "EPIPE") {
      socket.destroy();
      return;
    }
    // For genuine bad-request errors, close cleanly.
    if (socket.writable) {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    }
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  // Graceful shutdown handlers — allow in-flight requests to complete
  // before closing the process. PM2 waits ~1.6s before sending SIGKILL.
  const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}, initiating graceful shutdown...`);
    
    // Stop accepting new connections immediately
    server.close(() => {
      console.log("HTTP server closed, exiting process");
      process.exit(0);
    });

    // Force exit after 5 seconds if shutdown doesn't complete
    // (in-flight requests should finish within this time)
    const shutdownTimeout = setTimeout(() => {
      console.error("Graceful shutdown timeout, forcing exit");
      process.exit(1);
    }, 5000);

    // Don't keep the app alive if shutdown takes too long
    shutdownTimeout.unref();
  };

  // Listen for termination signals and shut down gracefully
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  // Catch unhandled exceptions to prevent zombie processes
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled rejection at:", promise, "reason:", reason);
    process.exit(1);
  });
});
