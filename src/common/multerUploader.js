require("dotenv").config();
const path = require("path");
const { ENV } = process.env;

const multer = require("multer");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = file.fieldname;

    if (ENV === "development") {
      cb(null, path.join(__dirname, "../../files/", folder));
    } else {
      cb(null, path.join(__dirname, "../../../public_html/assets/files/", folder));
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    console.log(file, "file", ext);
    cb(null, Date.now() + ext); // Nama file dengan timestamp
  },
});

// Initialize multer upload
const upload = multer({ storage: storage });

module.exports = upload;
