// Get the client
const mysql = require("mysql2");
require("dotenv").config();
const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
// Create the connection to database

const connection = mysql
  .createConnection({
    host: "localhost",
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
  })
  .promise();

// const getPengguna = async () => {
//   const [rows] = await connection.query("SELECT * FROM pengguna");
//   return rows;
// };

// const createPengguna = async (pengguna) => {
//   console.log(pengguna, "pengguna");
//   const [rows] = await connection.query(`INSERT INTO pengguna (username, password, nomor_ktp, aktif) VALUES (?, ?, ?, ?)`, [
//     pengguna.username,
//     pengguna.password,
//     pengguna.nomor_ktp,
//     pengguna.aktif,
//   ]);
//   return rows;
// };

// const updatePengguna = async (pengguna) => {
//   const [rows] = await connection.query(
//     `UPDATE pengguna
//     SET username = ?, password = ?, role = ?, nomor_ktp = ?, aktif = ?
//     WHERE id = ?
//     `,
//     [pengguna.username, pengguna.password, pengguna.role, pengguna.nomor_ktp, pengguna.aktif, pengguna.id]
//   );
//   return rows;
// };

// (async () => {
//   try {
//     // const data = await createPengguna({ username: "test@gmail.com", password: "test", nomor_ktp: "123", aktif: 1 });
//     // const data = await getPengguna();
//     // console.log(data);
//     // Optionally, close the connection after fetching the data
//     // await connection.end();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// })();

module.exports = connection;
