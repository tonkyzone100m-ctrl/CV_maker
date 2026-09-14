const app = require("./app");
const { port } = require("./config");
const { disconnectDatabase } = require("./db");

// Pass "0.0.0.0" to expose the port outside the Docker container
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`CV Maker API listening on port ${port}`);
});

async function shutdown() {
  await disconnectDatabase();
  server.close(() => process.exit(0));
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);