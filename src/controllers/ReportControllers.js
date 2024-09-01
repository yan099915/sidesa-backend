const services = require("../services");

module.exports = {
  // get request report
  getPortalReports: async (req, res) => {
    try {
      const { year } = req.query;

      const getReport = await services.report.getPortalReports(year);

      res.status(200).send({
        error: false,
        message: "Find report data success",
        data: getReport,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // get resident report
  getResidentReports: async (req, res) => {
    try {
      const { dusun } = req.query;

      const getReport = await services.report.getResidentReports(dusun);

      res.status(200).send({
        error: false,
        message: "Find report data success",
        data: getReport,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};
