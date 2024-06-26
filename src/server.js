const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const fs = require("fs");

// import router here
const router = require("./routes");

const app = express();
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

// active router
app.use(router.UserRouter);

// app.get("/", (req, res) => {
//   let files = fs.readdirSync(__dirname);

//   let file = fs.readFileSync("./Archive.zip");
//   console.log(file, "file");
//   console.log(files, "files");
//   res.json({ data: file });
// });

// app.get("/download", (req, res) => {
//   // Membaca file Archive.zip sebagai buffer
//   let filePath = "./Archive.zip";
//   let fileBuffer = fs.readFileSync(filePath);
//   console.log(fileBuffer, "fileBuffer");

//   // Mengatur header yang sesuai untuk pengunduhan file
//   res.setHeader("Content-Disposition", "attachment; filename=Archive.zip");
//   res.setHeader("Content-Type", "application/zip");

//   // Mengirim buffer sebagai respons
//   res.send(fileBuffer);
// });
module.exports = app;
