const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

module.exports = {
  // check if the user is authenticated jwt
  isAuth: async (req, res, next) => {
    try {
      const sessionToken = req.cookies.sessionToken;

      const decoded = jwt.verify(sessionToken, SECRET_KEY);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.log(error, "error");
      res.status(401).send({ error: true, message: "Unauthorized" });
    }
  },

  // check if the user is admin
  isAdmin: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.userId;
      const [result] = await connection.execute("SELECT * FROM pengguna WHERE id = ?", [req.userId]);
      if (result[0].role !== "admin") {
        return res.status(403).send({ error: true, message: "Forbidden" });
      }
      next();
    } catch (error) {
      res.status(401).send({ error: true, message: "Unauthorized" });
    }
  },
};
