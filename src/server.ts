import http from "http";
import app from "./app";
import { PORT } from "./config/index";
import { initSocketServer } from "./socket_server";

const server = http.createServer(app);

initSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
