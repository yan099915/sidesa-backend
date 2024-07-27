const server = require("./src/server");

// const { PORT, NODE_ENV } = process.env;

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
