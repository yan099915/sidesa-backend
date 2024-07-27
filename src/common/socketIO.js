const app = require("../server");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const cors = require("cors");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const clients = {};

io.on("connection", (socket) => {
  const { id, role } = socket.handshake.auth;

  clients[id] = { socketId: socket.id, role: role };
  console.log(`User ${id} with role ${role} connected with socket id ${socket.id}`);

  console.log(clients, "clients");

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    delete clients[userId];
  });
});

module.exports = server;
module.exports = io;
