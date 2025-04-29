const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const ENCRYPT_KEY = process.env.SECRET_ENCRYPT_KEY;

module.exports = {
  requestFiles: async (req, res) => {
    try {
      const { type, filename } = req.params;

      // console.log(type, filename, "req.params");
      // Validasi folder yg diizinkan
      const allowedTypes = ["foto_diri", "foto_ktp", "foto_kk"];
      if (!allowedTypes.includes(type)) {
        return res.status(400).send({ error: true, message: "Invalid file type" });
      }

      let filePath = "";
      if (process.env.ENV === "development") {
        filePath = path.join(__dirname, `../../files/${type}/${filename}`);
      } else {
        filePath = path.join(__dirname, `../../../public_html/portal/assets/files/${type}/${filename}`);
      }

      const ivPath = filePath + ".iv";

      if (!fs.existsSync(filePath) || !fs.existsSync(ivPath)) {
        return res.status(404).send({ error: true, message: "File not found" });
      }

      const encrypted = fs.readFileSync(filePath);
      const iv = fs.readFileSync(ivPath);
      const key = Buffer.from(ENCRYPT_KEY, "hex");

      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      const decryptedData = Buffer.concat([decipher.update(encrypted), decipher.final()]);

      res.setHeader("Content-Type", "image/png"); // atau sesuai mime-type
      res.send(decryptedData);
    } catch (error) {
      console.log(error, "error requestFiles");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },
};
