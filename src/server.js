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
const path = require("path");
const logger = require("./common/logger");

console.log(__dirname, "dirname");
const app = express();
const server = createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://localhost:4300",
      "https://portal.desarawang.com",
      "https://desarawang.com",
      "https://www.portal.desarawang.com",
      "https://www.desarawang.com",
    ], // Ganti dengan URL frontend Anda
    credentials: true, // Mengizinkan pengiriman cookie
  })
);
app.options("*", cors()); // Mengizinkan semua metode dari semua origin

// Active router
// Gunakan path absolut agar Express bisa menemukan foldernya
app.use("/files", express.static(path.join(__dirname, "../files")));

// Debugging: cek path yang digunakan
console.log("Serving static files from:", path.join(__dirname, "../files"));
app.use(router.UserRouter);
app.use(router.VerificationRouter);
app.use(router.ResidentRouter);
app.use(router.FamilyRouter);
app.use(router.RequestRouter);
app.use(router.NotificationRouter);
app.use(router.EmergencyRouter);
app.use(router.ArticleRouter);
app.use(router.PublicRouter);
app.use(router.AnnouncementRouter);
app.use(router.ReportRouter);
app.use(router.FileRouter);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200", "https://portal.desarawang.com", "https://www.portal.desarawang.com"], // Ganti dengan URL frontend Anda
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const clients = {};

io.on("connection", (socket) => {
  const { id, role } = socket.handshake.auth;

  clients[id] = { socketId: socket.id, role: role };
  // console.log(`User ${id} with role ${role} connected with socket id ${socket.id}`);

  // console.log(clients, "clients");

  socket.on("disconnect", () => {
    // console.log("Client disconnected:", socket.id);
    delete clients[id];
  });
});

const { PORT = 3000, ENV } = process.env;
server.listen(PORT, () => {
  // logger.info(`Server is running on http://localhost:${PORT} and using ${NODE_ENV} environment`);
  console.log(`Server is running on http://localhost:${PORT} and using ${ENV} environment`);
});

// Ekspor io, clients, dan sendMessageToRole agar bisa digunakan di file lain
module.exports = { app, io, clients };
