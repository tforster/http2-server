"use strict";

(async () => {
  const HTTP2Server = require("../src/HTTP2Server");
  const options = {};

  const httpServer = await new HTTP2Server(options);

  httpServer.listen().catch((reason) => {
    console.error(reason);
  });
})();
