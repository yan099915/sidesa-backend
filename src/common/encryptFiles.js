const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const encryptFile = (filePath, key) => {
  const iv = crypto.randomBytes(16);
  const data = fs.readFileSync(filePath);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

  fs.writeFileSync(filePath, encryptedData);
  fs.writeFileSync(filePath + ".iv", iv);
};

module.exports = encryptFile;
