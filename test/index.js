(async () => {
  const HTTP2Server = require("../src");
  const options = {
    root: "test",
  };
  const httpServer = await new HTTP2Server(options);
  httpServer.listen();
})();
