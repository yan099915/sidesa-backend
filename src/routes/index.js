// defines router
const UserRouter = require("./UsersRouters");
const VerificationRouter = require("./VerificationRouters");
const ResidentRouter = require("./ResidentRouters");
const FamilyRouter = require("./FamilyRouters");
const RequestRouter = require("./RequestRouters");
const NotificationRouter = require("./NotificationRouters");
const EmergencyRouter = require("./EmergencyRouters");
const ArticleRouter = require("./ArticlesRouters");
const AnnouncementRouter = require("./AnnouncementRouters");
const PublicRouter = require("./PublicRouters");
const ReportRouter = require("./ReportRouters");

// export router
module.exports = {
  UserRouter,
  VerificationRouter,
  ResidentRouter,
  FamilyRouter,
  RequestRouter,
  NotificationRouter,
  EmergencyRouter,
  ArticleRouter,
  AnnouncementRouter,
  PublicRouter,
  ReportRouter,
};
