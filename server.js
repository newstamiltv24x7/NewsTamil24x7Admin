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

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
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
});
