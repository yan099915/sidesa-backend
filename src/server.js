require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import router here
const router = require("./routes");

const app = express();
const server = createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:4200", "https://portal.sidera.my.id"], // Ganti dengan URL frontend Anda
    credentials: true, // Mengizinkan pengiriman cookie
  })
);
app.options("*", cors()); // Mengizinkan semua metode dari semua origin

// Active router
app.use(router.UserRouter);
app.use(router.VerificationRouter);
app.use(router.ResidentRouter);
app.use(router.FamilyRouter);
app.use(router.RequestRouter);
app.use(router.NotificationRouter);
app.use(router.EmergencyRouter);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200", "https://portal.sidera.my.id"], // Ganti dengan URL frontend Anda
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
    delete clients[id];
  });
});

const { PORT = 3000, NODE_ENV } = process.env;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} and using ${NODE_ENV} environment`);
});

// Ekspor io, clients, dan sendMessageToRole agar bisa digunakan di file lain
module.exports = { app, io, clients };
