// so tests don't run on the same port with server

const app = require("./app");
const port = process.env.port || 3001;
const server = app.listen(port, () => {});

module.exports = server;
