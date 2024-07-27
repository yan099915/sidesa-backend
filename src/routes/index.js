// defines router
const UserRouter = require("./UsersRouters");
const VerificationRouter = require("./VerificationRouters");
const ResidentRouter = require("./ResidentRouters");
const FamilyRouter = require("./FamilyRouters");
const RequestRouter = require("./RequestRouters");
const NotificationRouter = require("./NotificationRouters");
const EmergencyRouter = require("./EmergencyRouters");
// export router
module.exports = {
  UserRouter,
  VerificationRouter,
  ResidentRouter,
  FamilyRouter,
  RequestRouter,
  NotificationRouter,
  EmergencyRouter,
};
