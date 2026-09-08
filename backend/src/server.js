const app = require("./app");
const { port } = require("./config");
const { disconnectDatabase } = require("./db");

const server = app.listen(port, () => {
  console.log(`CV Maker API listening on http://localhost:${port}`);
});

async function shutdown() {
  await disconnectDatabase();
  server.close(() => process.exit(0));
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
