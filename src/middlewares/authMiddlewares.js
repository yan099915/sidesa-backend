const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const services = require("../services");
// const logger = require("../common/logger");

module.exports = {
  // check if the user is authenticated jwt
  isAuth: async (req, res, next) => {
    try {
      const sessionToken = req.cookies.sessionToken;

      // check if the token is valid
      const decoded = jwt.verify(sessionToken, SECRET_KEY);
      // console.log(decoded, "decoded");

      // if jwt is expired
      if (decoded.exp < Date.now().valueOf() / 1000) {
        return res.status(401).send({ error: true, message: "Token expired" });
      }

      const criteria = {
        name: "id",
        value: decoded.userId,
      };
      const checkSession = await services.users.checkSession(criteria);

      // check if token same with saved token
      const savedToken = checkSession.session;

      if (sessionToken === savedToken) {
        // if the token is valid, set userId in req
        req.userId = decoded.userId;
        next();
      } else {
        return res.status(401).send({ error: true, message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(401).send({ error: true, message: "Unauthorized" });
    }
  },

  // check if the user is admin
  isAdmin: async (req, res, next) => {
    try {
      //check if there is no token
      if (!req.cookies.sessionToken) {
        return res.status(401).send({ error: true, message: "Unauthorized" });
      }

      // check if the token is valid
      const sessionToken = req.cookies.sessionToken;
      const decoded = jwt.verify(sessionToken, SECRET_KEY);

      // if jwt is expired
      if (decoded.exp < Date.now().valueOf() / 1000) {
        return res.status(401).send({ error: true, message: "Token expired" });
      }

      // check if the user is admin
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: decoded.userId });

      if (findUserByCriteria.role < 2) {
        return res.status(401).send({ error: true, message: "Unauthorized" });
      }

      // if the token is valid, set userId in req
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).send({ error: true, message: "Unauthorized" });
    }
  },

  // Middleware autentikasi untuk Socket.IO
  isSocketAuth: async (socket, next) => {
    try {
      const sessionToken = socket.handshake.auth.token;

      // check if the token is valid
      const decoded = jwt.verify(sessionToken, SECRET_KEY);

      // if jwt is expired
      if (decoded.exp < Date.now().valueOf() / 1000) {
        return next(new Error("Token expired"));
      }

      const criteria = {
        name: "id",
        value: decoded.userId,
      };
      const checkSession = await services.users.checkSession(criteria);

      // check if token same with saved token
      const savedToken = checkSession.session;

      if (sessionToken === savedToken) {
        // if the token is valid, set userId in socket
        socket.userId = decoded.userId;
        next();
      } else {
        return next(new Error("Unauthorized"));
      }
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  },
};
