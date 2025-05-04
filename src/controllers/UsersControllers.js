const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../common/emailTransporter");
const emailLayout = require("./EmailLayout");
const createEmailLayoutResetPassword = require("./EmailLayoutResetPassword");
const services = require("../services");
const logger = require("../common/logger");
const { ENV, SECRET_KEY, SECRET_KEY_PASS_RESET, EMAIL_USER, DOMAIN } = process.env;

module.exports = {
  // Register user
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if email or password is empty
      if (!email || !password) {
        return res.status(400).send({ error: true, message: "Email or password is empty" });
      }

      // Check if email is already used
      const findUserByCriteria = await services.users.findUsers({
        name: "email",
        value: email,
      });

      if (findUserByCriteria !== null) {
        return res.status(400).send({ error: true, message: "Email already used" });
      }

      // Insert email and hashed password into database
      const createNewUser = await services.users.createUser({ email, password: hashedPassword });

      const userId = createNewUser.id;

      // Generate verification token
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
      let verificationUrl = `${DOMAIN}/#/email-verify/${token}`;

      let message = {
        from: EMAIL_USER,
        to: email,
        subject: "Sidera account verification",
        html: `${emailLayout(verificationUrl)}`,
      };

      // Send verification email
      transporter
        .sendMail(message)
        .then((info) => {
          console.log("Email sent: ", info.response);
          logger.info(`Email sent: ${info.response}`);
        })
        .catch((error) => {
          logger.info(`${EMAIL_USER}, ${email}, ${verificationUrl}`);
          logger.error(`Error sending email: ${error}`);
          console.error("Error sending email: ", error);
        });

      res.status(201).send({
        error: false,
        message: "User register success",
        data: {},
      });
    } catch (error) {
      logger.error(`ERROR REGISTER: ${error}`);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // Resend verification email
  resendEmail: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if email is empty
      if (!email) {
        return res.status(400).send({ error: true, message: "Email is empty" });
      }

      // find user by email
      const findUserByCriteria = await services.users.findUsers({
        name: "email",
        value: email,
      });

      // Check if email is not found
      if (findUserByCriteria === null) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }
      // check if email is already verified
      if (findUserByCriteria.verified === 1) {
        return res.status(400).send({ error: true, message: "Email already verified", data: { active: 1 } });
      }

      const userId = findUserByCriteria.id;

      // Generate verification token
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
      let verificationUrl = `${DOMAIN}/#/email-verify/${token}`;

      let message = {
        from: EMAIL_USER,
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

      // check if token is invalid
      if (!userId) {
        return res.status(400).send({ error: true, message: "Invalid token", data: {} });
      }

      const findUserByCriteria = await services.users.findUsers({ name: "id", value: userId });

      // check if user is already verified
      if (findUserByCriteria.aktif) {
        return res.status(400).send({ error: true, message: "Email already verified", data: {} });
      }

      // update user to verified
      await services.users.updateUser({ name: "id", value: findUserByCriteria.id }, { aktif: 1 });

      res.status(200).send({ error: false, message: "Email verified", data: { email: findUserByCriteria.email } });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(400).send({ error: true, message: "Invalid token" });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password, remember } = req.body;

      // console.log(email, password, "email, password");
      const findUserByCriteria = await services.users.findUsers({ name: "email", value: email });

      // console.log(findUserByCriteria, "findUserByCriteria");
      // Check if user is not found
      if (findUserByCriteria === null) {
        return res.status(401).send({ error: true, message: "Invalid email or password", data: { active: false } });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, findUserByCriteria.password);
      if (passwordMatch) {
        // Check if email is verified
        if (!findUserByCriteria.aktif) {
          return res.status(401).send({ error: true, message: "Email not verified", data: { active: false, email: findUserByCriteria.email } });
        }

        const rememberMe = remember === true ? "1d" : "1h";
        // Generate token
        const token = jwt.sign({ userId: findUserByCriteria.id, email: findUserByCriteria.email }, SECRET_KEY, { expiresIn: rememberMe });

        const saveSession = await services.users.saveSession({ name: "id", value: findUserByCriteria.id }, { session: token });

        if (saveSession === null) return res.status(500).send({ error: true, message: "Internal server error" });

        // set cookie
        res.cookie("sessionToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        // send respons
        res.status(200).send({ error: false, message: "Login success", data: { active: findUserByCriteria.aktif, token: token } });
      } else {
        res.status(401).send({ error: true, message: "Invalid email or password", data: { active: false } });
      }
    } catch (error) {
      logger.error(`ERROR LOGIN: ${error}`);
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // Reset password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const findUserByCriteria = await services.users.findUsers({ name: "email", value: email });
      console.log(findUserByCriteria, "data");
      // Check if user is not found
      if (!findUserByCriteria) {
        return res.status(200).send({ error: false, message: "Password reset success if email correct you will receive in your inbox." });
      }
      const userId = findUserByCriteria.id;
      const token = jwt.sign({ userId }, SECRET_KEY_PASS_RESET, { expiresIn: "15m" });
      let resetPasswordUrl = `${DOMAIN}/#/reset-password/${token}`;

      // Send reset password email
      let message = {
        from: EMAIL_USER,
        to: email,
        subject: "Sidera account reset password",
        html: `${createEmailLayoutResetPassword(resetPasswordUrl)}`,
      };

      // Send reset password email
      transporter.sendMail(message);

      res.status(200).send({
        error: false,
        message: "Password reset success if email correct you will receive in your inbox.",
        data: {},
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  forgotPasswordCheckToken: async (req, res) => {
    try {
      const { token } = req.query;
      const { userId } = jwt.verify(token, SECRET_KEY_PASS_RESET);

      // check if token is invalid
      if (!userId) {
        return res.status(400).send({ error: true, message: "Invalid token", data: {} });
      }

      // find user by id
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: userId });

      // check if user is not found
      if (findUserByCriteria === null) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }

      res.status(200).send({
        error: false,
        message: "Token valid",
        data: {},
      });
    } catch (error) {
      // console.error("Error verifying token:", error);
      res.status(400).send({ error: true, message: "Invalid token" });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      const { userId } = jwt.verify(token, SECRET_KEY_PASS_RESET);

      console.log(userId, "userId");
      // check if token is invalid
      if (!userId) {
        return res.status(400).send({ error: true, message: "Invalid token", data: {} });
      }
      // find user by id
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: userId });
      // check if user is not found
      if (findUserByCriteria === null) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }
      // check if password is empty
      if (!password) {
        return res.status(400).send({ error: true, message: "Password is empty", data: {} });
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // update password
      const updatePassword = await services.users.updateUser({ name: "id", value: userId }, { password: hashedPassword });
      // check if update password is success
      if (updatePassword === null) {
        return res.status(500).send({ error: true, message: "Internal server error", data: {} });
      }
      // remove session token
      res.clearCookie("sessionToken");
      // send response
      res.status(200).send({
        error: false,
        message: "Password reset success",
        data: {},
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(400).send({ error: true, message: "Invalid token" });
    }
  },

  //change password
  updatePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.userId;

      // check if old password and new password is empty
      if (!oldPassword || !newPassword) {
        return res.status(400).send({ error: true, message: "Old password or new password is empty", data: {} });
      }

      // find user by id
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: userId });

      // check if user is not found
      if (findUserByCriteria === null) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }

      // compare old password with hashed password
      const passwordMatch = await bcrypt.compare(oldPassword, findUserByCriteria.password);
      if (!passwordMatch) {
        return res.status(401).send({ error: true, message: "Old password is incorrect", data: {} });
      }

      // hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // update password
      const updatePassword = await services.users.updateUser({ name: "id", value: userId }, { password: hashedNewPassword });

      // check if update password is success
      if (updatePassword === null) {
        return res.status(500).send({ error: true, message: "Internal server error", data: {} });
      }

      res.status(200).send({
        error: false,
        message: "Change password success",
        data: {},
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
  // update password end here

  // check user session token validity
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

      if (!decoded) return res.status(401).send({ error: true, message: "Session token invalid", data: {} });

      // if jwt is expired
      if (decoded.exp < Date.now().valueOf() / 1000) {
        return res.status(401).send({ error: true, message: "Token expired" });
      }

      // find user by id
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: decoded.userId });

      // Determine account status based on nomor_ktp
      const active = findUserByCriteria.active;
      const verified = findUserByCriteria.verified === 1;

      res.status(200).send({
        error: false,
        message: "Session token valid",
        data: {
          id: findUserByCriteria.id,
          active: findUserByCriteria.aktif,
          verified: findUserByCriteria.verified,
          role: findUserByCriteria.role,
          email: findUserByCriteria.email,
          nik: findUserByCriteria.nomor_ktp,
          nkk: findUserByCriteria?.penduduk?.nomor_kk,
        },
      });
    } catch (error) {
      // remove cookie
      res.clearCookie("sessionToken");
      res.status(500).send({ error: true, message: "Session token invalid", data: {} });
    }
  },

  // logout
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
      // console.log(req.userId, "req.userId");
      if (!req.userId) {
        return res.status(401).send({ error: true, message: "Unauthorized", data: {} });
      }

      // find user
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: req.userId });

      // if user not found
      if (findUserByCriteria === null) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }

      // get user menu
      const getUserMenu = await services.menu.getUserMenus(findUserByCriteria.role);

      if (getUserMenu === null) {
        return res.status(404).send({ error: true, message: "Menu not found", data: {} });
      }

      res.status(200).send({
        error: false,
        message: "Get menu success",
        data: { menu: getUserMenu },
      });
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  // user notification
  getNotification: async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).send({ error: true, message: "Unauthorized", data: {} });
      }

      // find user
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: req.userId });

      // if user not found
      if (findUserByCriteria === null) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }

      // get user notification
      const getUserNotification = await services.notification.getUserNotifications(findUserByCriteria.id);

      if (getUserNotification === null) {
        return res.status(404).send({ error: true, message: "Notification not found", data: {} });
      }

      res.status(200).send({
        error: false,
        message: "Get notification success",
        data: { notification: getUserNotification },
      });
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },
};
