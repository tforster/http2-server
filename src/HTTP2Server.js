"use strict";

// System dependencies (Built in modules)
const fs = require("fs").promises;
const { createReadStream } = require("fs");
const http2 = require("http2");
const path = require("path");

/**
 * A lightweight, dependency free, wrapper around Node's HTTP2 module. Supports extensionless .html files similar to AWS Amplify
 * @class HTTP2Server
 */
class HTTP2Server {
  /**
   *Creates an instance of HTTP2Server.
   * @param {object} options: Basic options to override defaults
   * @memberof HTTP2Server
   */
  constructor(options = {}) {
    options.index = options.index || "index.html";
    options.port = options.port || 3701;
    options.root = options.root ? path.resolve(options.root) : process.cwd();
    // ToDo: Yeah, probably not a good idea putting cert files in the server root. But you're just using this for local development right?
    options.cert = options.cert ? path.resolve(options.cert) : options.root;
    this.options = options;
  }

  /**
   * Returns a mimetype for the supplied file extension
   * ToDo: Allow the internal settings to be overridden by a JSON doc referenced in the initial arguments
   * @param {string} extension: The filename extension
   * @returns {string}:         The associated mimetype
   * @memberof Http2Server
   */
  _mimeType(extension) {
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",

      ".png": "image/png",
      ".jpg": "image/jpg",
      ".jpeg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",

      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",

      ".wav": "audio/wav",
      ".mp4": "video/mp4",
    };
    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  }

  /**
   * Handler to pass to createSecureServer
   *
   * @param {object} req: HTTP2 Request object
   * @param {object} res: HTTP2 Response object
   * @memberof HTTP2Server
   */
  _onRequest(req, res) {
    const _this = this;
    // Log the request path
    // ToDo: This should be behind a debug flag
    console.log(`Req: ${req.url}`);
    // Get the clean URL
    const url = req.url.split("?")[0];
    // Get the file path and name or set to index if requesting the root
    const file = url !== "/" ? url : _this.options.index;
    // Get the lowercase extension from the file name
    let extension = String(path.extname(file)).toLowerCase();
    // Create the full path to the file
    let filePath = path.join(_this.options.root, file);

    // If there is no extension, cast to .html, similar to AWS Amplify
    if (extension === "") {
      filePath = filePath + ".html";
      extension = ".html";
    }

    // Stat the file path to confirm we have a real file
    fs.stat(filePath)
      .then((stat) => {
        if (stat.isFile()) {
          const type = _this._mimeType(extension);

          const readStream = createReadStream(filePath);
          readStream.on("close", () => {
            res.end(null, "utf-8");
          });

          res.writeHead(200, { "Content-Type": type });
          readStream.pipe(res);
        } else {
          console.error(404);
        }
      })
      .catch((reason) => {
        console.error(reason);
        res.writeHead(404);
        return res.end(`${filePath} not found`);
      });
  }

  /**
   * Our wrapper around HTTP2Server .listen() with a little sugar
   * @memberof HTTP2Server
   */
  async listen() {
    // ! Don't forget to generate a key pair using src/create-certs.sh
    const [key, cert] = await Promise.all([
      fs.readFile(path.join(this.options.cert, "localhost-privkey.pem")),
      fs.readFile(path.join(this.options.cert, "localhost-cert.pem")),
    ]).catch((reason) => {
      if (reason.code === "ENOENT") {
        throw "Missing certificate file(s). Try running 'npm run create-certs' or specifying their location with the --cert argument.";
      } else {
        throw reason;
      }
    });

    //Create an instance
    const server = http2.createSecureServer(
      {
        key,
        cert,
      },
      this._onRequest.bind(this)
    );
    // Invoke the listener on the port
    console.log(`HTTP2 Server is listening on ${this.options.port} for requests for ${this.options.root}`);
    server.listen(this.options.port);
  }
}

// Export HTTP2Server class so it can be used programmatically
module.exports = HTTP2Server;
