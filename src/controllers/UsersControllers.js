const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../database/database");
const env = require("dotenv").config();
const { SECRET_KEY } = process.env;

module.exports = {
  // start of register
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // check email if already used
      const [resultEmail] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);
      if (resultEmail.length > 0) {
        res.status(400).send({ error: true, message: "Email already used" });
        return;
      }
      // end of check email if already used

      // insert email and password to database
      const [result] = await connection.execute("INSERT INTO pengguna (email, password, aktif) VALUES (?, ?, ?)", [email, hashedPassword, false]);

      const userId = result.insertId;
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "5m" });

      const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

      // await transporter.sendMail({
      //   to: email,
      //   subject: "Verify your email",
      //   html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
      // });

      res.status(201).send({
        error: false,
        data: verificationUrl,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
  // end of register

  // start of resend email
  resendEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);
      const user = result[0];
      const userId = user.id;
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "5m" });

      const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

      // await transporter.sendMail({
      //   to: email,
      //   subject: "Verify your email",
      //   html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
      // });

      res.status(201).send({
        error: false,
        data: verificationUrl,
      });
    } catch (error) {
      res.send({ error: true, message: "Internal server error" });
    }
  },
  // end of resend email

  // start of verify email
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      const { userId } = jwt.verify(token, SECRET_KEY);
      await connection.execute("UPDATE pengguna SET aktif = true WHERE id = ?", [userId]);
      res.send({ error: false, message: "Email verified" });
    } catch (error) {
      res.status(400).send({ error: true, message: "Invalid token" });
    }
  },

  // start of login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);
      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      const isActive = user.aktif;

      // check if user is not found
      if (!user) {
        res.status(404).send({ error: true, message: "User is not registered" });
        return;
      }

      // check if email is verified
      if (!isActive) {
        res.status(401).send({ error: true, message: "Email not verified" });
        return;
      }

      // check if password match
      if (passwordMatch) {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.send({ error: false, data: { token } });
      } else {
        res.status(401).send({ error: true, message: "Invalid email or password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
  // end of login

  // start of forgot password
  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);
      const user = result[0];
      const userId = user.id;
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "5m" });

      // if user is not found
      if (!user) {
        res.status(404).send({ error: true, message: "User not found" });
        return;
      }

      //   await transporter.sendMail({
      //     to: email,
      //     subject: "Reset your password",
      //     html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>`,
      //   });

      res.status(200).send({
        error: false,
        message: "Password reset email sent",
        data: resetPasswordUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
  // end of forgot password
};
