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
    // Only add the .html extension when specified
    let index = "index" + (options.extensions ? ".html" : "");
    options.index = options.index || index;
    options.port = options.port || 3701;
    options.root = options.root ? path.resolve(options.root) : process.cwd();
    options.cert = options.cert ? path.resolve(options.cert) : options.root;
    this.options = options;

    // Get list of mimeTypes including any additions passed in the --mime CLI arg
    const mimeAdditions = options.mime ? JSON.parse(options.mime) : null;
    this.mimeTypes = this._getMimeTypes(mimeAdditions);
  }

  /**
   * Returns a list of mimeTypes. Can be augmented by passing additional types in --mime CLI arg
   * @param {*} [mimeAdditions={}]: An optional hash of extension/mime pairs in the format { ".extension": "mime/type" }
   * @returns:                      A hash of mime types by extension
   * @memberof HTTP2Server
   */
  _getMimeTypes(mimeAdditions = {}) {
    return {
      ...{
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
      },
      ...mimeAdditions,
    };
  }

  /**
   * Returns a mimetype for the supplied file extension
   * @param {string} extension: The filename extension
   * @returns {string}:         The associated mimetype
   * @memberof Http2Server
   */
  _mimeType(extension) {
    return this.mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  }

  /**
   * Handler to pass to createSecureServer
   *
   * @param {object} req: HTTP2 Request object
   * @param {object} res: HTTP2 Response object
   * @memberof HTTP2Server
   */
  async _onRequest(req, res) {
    const _this = this;
    // Log the request path. HTTP2Server is intended for development use only so we can assume verbose logging is acceptable.
    console.log(`\nReq: ${req.url}`);
    // Set a default statusCode
    let statusCode = 200;
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
      // If the last character is a forward slash, add the index to the path
      // ex: https://localhost/example/  ->  /example/index
      if (filePath.slice(-1) === "/") {
        filePath += "index";
      }
      // Only add the .html extension when specified
      // ex: https://localhost/example/  ->  /example/index.html
      if (this.options.extensions) {
        filePath = filePath + ".html";
      }
      // Always default to HTML as the default for extensionless
      extension = ".html";
    }

    try {
      const stat = await fs.stat(filePath);
      if (stat.isFile()) {
        // We have a legit file
        const type = _this._mimeType(extension);

        const readStream = createReadStream(filePath);

        // End the response stream when the incoming file stream ends
        readStream.on("close", () => {
          res.end(null, "utf-8");
        });

        // Send a 200 header
        res.writeHead(statusCode, { "Content-Type": type });

        // Pipe the file to the response
        readStream.pipe(res);

        console.log(`${statusCode}: ${filePath}`);
      } else {
        // Should not hit this condition since we cast everything to a file at line ~79. Should see 404 instead.
      }
    } catch (err) {
      // ToDo: Add more specific errors on a case-by-case basis
      if (err.code && err.code === "ENOENT") {
        // 404
        statusCode = 404;
      } else {
        // Default to 500
        statusCode = 500;
      }
      console.error(`${statusCode}: ${filePath}. ${err.message}`);
      res.writeHead(statusCode);
      res.end();
    }
  }

  /**
   * Our wrapper around HTTP2Server .listen() with a little sugar
   * @memberof HTTP2Server
   */
  async listen() {
    // ! Don't forget to generate a key pair using src/create-certs.sh or npm run create-certs
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
