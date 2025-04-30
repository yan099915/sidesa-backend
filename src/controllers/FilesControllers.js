const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const mime = require("mime-types");
const ENCRYPT_KEY = process.env.SECRET_ENCRYPT_KEY;
const FILE_PATH = process.env.BASE_FILE_PATH;

module.exports = {
  requestFiles: async (req, res) => {
    try {
      const { type, filename } = req.params;
      const contentType = mime.lookup(filename) || "application/octet-stream";
      // console.log(type, filename, "req.params");
      // Validasi folder yg diizinkan
      const allowedTypes = ["foto_diri", "foto_ktp", "foto_kk"];
      if (!allowedTypes.includes(type)) {
        return res.status(400).send({ error: true, message: "Invalid file type" });
      }

      let filePath = path.join(__dirname, `${FILE_PATH}${type}/${filename}`);

      // Jika foto_diri, langsung kirim tanpa decrypt
      //   if (type === "foto_diri") {
      //     const fileStream = fs.createReadStream(filePath);
      //     res.setHeader("Content-Type", contentType); // Atur sesuai file
      //     return fileStream.pipe(res);
      //   }

      const ivPath = filePath + ".iv";

      if (!fs.existsSync(filePath) || !fs.existsSync(ivPath)) {
        return res.status(404).send({ error: true, message: "File not found" });
      }

      const encrypted = fs.readFileSync(filePath);
      const iv = fs.readFileSync(ivPath);
      const key = Buffer.from(ENCRYPT_KEY, "hex");

      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      const decryptedData = Buffer.concat([decipher.update(encrypted), decipher.final()]);

      res.setHeader("Content-Type", contentType); // atau sesuai mime-type
      res.send(decryptedData);
    } catch (error) {
      console.log(error, "error requestFiles");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  profilePicture: async (req, res) => {
    try {
      const { filename } = req.params;
      const contentType = mime.lookup(filename) || "application/octet-stream";

      let filePath = path.join(__dirname, `${FILE_PATH}foto_diri/${filename}`);
      const ivPath = filePath + ".iv";

      if (!fs.existsSync(filePath)) {
        return res.status(404).send({ error: true, message: "File not found" });
      }

      const encrypted = fs.readFileSync(filePath);
      const iv = fs.readFileSync(ivPath);
      const key = Buffer.from(ENCRYPT_KEY, "hex");
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      const decryptedData = Buffer.concat([decipher.update(encrypted), decipher.final()]);

      res.setHeader("Content-Type", contentType); // atau sesuai mime-type
      res.send(decryptedData);
    } catch (error) {
      console.log(error, "error profilePicture");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },
};
