const bcrypt = require("bcrypt");
const services = require("../services");

module.exports = {
  getFamilyInfo: async (req, res) => {
    try {
      const userId = req.userId;
      const { nomor_kk } = req.query;

      const familyInfo = await services.family.getFamilyDetails({ name: "nomor_kk", value: nomor_kk });
      if (!familyInfo) {
        return res.status(204).send({ error: false, message: "Family data not found" });
      }

      res.status(200).send({
        error: false,
        message: "Find family data success",
        data: familyInfo,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};
