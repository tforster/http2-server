"use strict";

/**
 * Simple CLI argument processor
 *
 * --port: "3701" // TCP port to listen on
 * --root: "/src" // Path to directory on filesystem to serve
 * --cert: "/src" // Path to directory containing cert files named localhost-privkey.pem and localhost-cert.pem
 * --mime: "{".html":"text/plain"}"
 * --extensions: "true" // Set to true if the local files have .html extensions
 *
 * @returns {object}: Hash of options
 */
function getOptions() {
  const options = {};
  const args = process.argv.slice(2);
  args.map((arg, i) => {
    if (arg.indexOf("--") === 0 && i < args.length && args[i + 1].indexOf("--") !== 0) {
      options[arg.slice(2)] = args[i + 1];
    }
  });
  return options;
}

(async () => {
  const HTTP2Server = require("./HTTP2Server");
  const httpServer = await new HTTP2Server(getOptions());
  httpServer.listen().catch(console.error);
})();
