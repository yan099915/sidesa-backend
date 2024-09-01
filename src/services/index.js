const { report } = require("../routes/UsersRouters");

// services list
const services = {
  users: require("./UsersServices"),
  menu: require("./MenuServices"),
  verification: require("./VerificationServices"),
  resident: require("./ResidentServices"),
  family: require("./FamilyServices"),
  request: require("./RequestServices"),
  notification: require("./NotificationServices"),
  emergency: require("./EmergencyServices"),
  socket: require("./SocketIOServices"),
  article: require("./ArticleServices"),
  announcement: require("./AnnouncementServices"),
  report: require("./ReportServices"),
};

module.exports = services;
