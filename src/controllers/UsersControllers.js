const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../database/database");
const nodemailer = require("nodemailer");
const { SECRET_KEY, EMAIL_USER, EMAIL_PASS, SMTP_HOST, SMTP_PORT } = process.env;
const emailLayout = require("./EmailLayout");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 465,
  secure: true, // Gunakan 'true' jika port 465, 'false' jika port lain
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.error("Error verifying transporter:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

module.exports = {
  // Register user
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if email is already used
      const [resultEmail] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);
      if (resultEmail.length > 0) {
        return res.status(400).send({ error: true, message: "Email already used" });
      }

      // Insert email and hashed password into database
      const [result] = await connection.execute("INSERT INTO pengguna (email, password, aktif) VALUES (?, ?, ?)", [email, hashedPassword, false]);
      const userId = result.insertId;

      // Generate verification token
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
      const verificationUrl = `http://localhost:4200/#/email-verify/${token}`;

      let message = {
        from: "noreply@sidera.my.id",
        to: email,
        subject: "Sidera account verification",
        html: `${emailLayout(verificationUrl)}`,
      };

      // Send verification email
      transporter.sendMail(message);

      res.status(201).send({
        error: false,
        message: "User register success",
        data: {},
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // Resend verification email
  resendEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);

      // Check if user is not found
      if (result.length === 0) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }

      // Check if email is already verified
      if (result[0].aktif) {
        return res.status(400).send({ error: true, message: "Email already verified", data: { active: 1 } });
      }

      const userId = result[0].id;

      console.log(userId, "userId");
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
      const verificationUrl = `http://localhost:4200/#/email-verify/${token}`;

      let message = {
        from: "noreply@sidera.my.id",
        to: email,
        subject: "Sidera account verification",
        html: `${emailLayout(verificationUrl)}`,
      };

      // Send verification email
      transporter.sendMail(message);

      res.status(201).send({
        error: false,
        data: {},
      });
    } catch (error) {
      console.error("Error resending email:", error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // Verify email
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      const { userId } = jwt.verify(token, SECRET_KEY);

      const [result] = await connection.execute("SELECT * FROM pengguna WHERE id = ?", [userId]);

      // check if token is invalid
      if (!userId) {
        return res.status(400).send({ error: true, message: "Invalid token", data: {} });
      }

      // check if user is already verified
      if (result[0].aktif) {
        return res.status(400).send({ error: true, message: "Email already verified", data: {} });
      }

      // Update user to verified
      await connection.execute("UPDATE pengguna SET aktif = true WHERE id = ?", [userId]);
      res.status(200).send({ error: false, message: "Email verified", data: { email: result[0].email } });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(400).send({ error: true, message: "Invalid token" });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);
      const user = result[0];

      // Check if user is not found
      if (!user) {
        return res.status(404).send({ error: true, message: "Invalid email or password", data: { active: false } });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Check if email is verified
        if (!user.aktif) {
          return res.status(401).send({ error: true, message: "Email not verified", data: { active: false, email: user.email } });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        // set cookie
        res.cookie("sessionToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        // send respons
        res.status(200).send({ error: false, message: "Login success", data: { active: true, token: token } });
      } else {
        res.status(401).send({ error: true, message: "Invalid email or password", data: { active: false } });
      }
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE email = ?", [email]);
      const user = result[0];

      // Check if user is not found
      if (!user) {
        return res.status(404).send({ error: true, message: "User not found" });
      }

      const userId = user.id;
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "5m" });
      const resetPasswordUrl = `http://localhost:4200/#/reset-password/${token}`;

      // Send reset password email
      await transporter.sendMail({
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>`,
      });

      res.status(200).send({
        error: false,
        message: "Password reset email sent",
        data: resetPasswordUrl,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  sessionToken: async (req, res) => {
    try {
      //remove sessionToken= from cookie
      // get cookie from request
      const sessionToken = req.cookies.sessionToken;
      // check if sessionToken is empty
      if (!sessionToken) {
        return res.status(401).send({ error: true, message: "Session token invalid", data: {} });
      }
      const decoded = jwt.verify(sessionToken, SECRET_KEY);

      const [result] = await connection.execute("SELECT * FROM pengguna WHERE id = ?", [decoded.userId]);
      const user = result[0];

      // Determine account status based on nomor_ktp
      const active = user.active === 1;
      const verified = user.verified === 1;

      res.status(200).send({
        error: false,
        message: "Session token valid",
        data: { active: active, verified: verified, email: user.email },
      });
    } catch (error) {
      // remove cookie
      res.clearCookie("sessionToken");
      res.status(500).send({ error: true, message: "Session token invalid", data: {} });
    }
  },

  logout: async (req, res) => {
    // remove cookie
    try {
      res.clearCookie("sessionToken");
      res.status(200).send({
        error: false,
        message: "Logout success",
        data: {},
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  // menu list
  getMenu: async (req, res) => {
    try {
      const [fetchUserData] = await connection.execute("SELECT * FROM pengguna WHERE id = ?", [req.userId]);
      const userData = fetchUserData[0];
      const [result] = await connection.execute("SELECT * FROM menu WHERE access <= ?", [userData.role]);
      res.status(200).send({
        error: false,
        message: "Get menu success",
        data: { menu: result },
      });
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  requestDataVerification: async (req, res) => {
    try {
      const { ktp, ktpNumber, kkNumber, name, birthDate, birthPlace, address, religion, maritalStatus, job, rt, rw } = req.body;

      const foto_diri = req.files["foto_diri"] ? req.files["foto_diri"][0].filename : null;
      const foto_ktp = req.files["foto_ktp"] ? req.files["foto_ktp"][0].filename : null;
      const foto_kk = req.files["foto_kk"] ? req.files["foto_kk"][0].filename : null;

      // Check if user is not found
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE id = ?", [req.userId]);
      if (result.length === 0) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }

      // Insert to database table verification
      const [insertResult] = await connection.execute(
        `INSERT INTO verification (
          foto_diri, foto_ktp, foto_kk, nomor_ktp, nomor_kk, nama, tanggal_lahir, tempat_lahir, alamat, agama, RT, RW, pekerjaan, status_perkawinan, id_pengguna
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [foto_diri, foto_ktp, foto_kk, ktpNumber, kkNumber, name, birthDate, birthPlace, address, religion, rt, rw, job, maritalStatus, req.userId]
      );

      res.send({ error: false, message: "Request data verification success", data: insertResult });
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  checkVerificationStatus: async (req, res) => {
    try {
      const [result] = await connection.execute("SELECT * FROM verification WHERE id_pengguna = ?", [req.userId]);
      if (result.length === 0) {
        return res.status(404).send({ error: true, message: "Verification data not found", data: {} });
      }

      res
        .status(200)
        .send({ error: false, message: "Verification data found", data: { verificationStatus: result[0].status, notes: result[0].notes } });
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },
};
