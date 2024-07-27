// import services
const services = require("../services");
// const { io } = require("../common/socketIO");

module.exports = {
  // get emergency list
  getEmergencies: async (req, res) => {
    try {
      const { page, limit, search, jenis_kejadian, status_kejadian } = req.query;
      const userId = req.userId;

      const findEmergencyData = await services.emergency.getEmergencies(page, limit, search, status_kejadian, jenis_kejadian);
      if (findEmergencyData.length === 0) {
        return res.status(204).send({ error: false, message: "Emergency data not found" });
      }

      // console.log(findEmergencyData, "findEmergencyData");

      res.status(200).send({
        error: false,
        message: "Find emergency data success",
        data: findEmergencyData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // get emergency details
  emergencyDetails: async (req, res) => {
    try {
      const { id } = req.params;
      //   console.log(id, "id");
      // check if id value is empty
      if (!id) {
        return res.status(400).send({ error: true, message: "Id is required" });
      }

      const findEmergencyData = await services.emergency.getEmergencyDetails({ name: "id", value: id });
      //   console.log(findEmergencyData, "findEmergencyData");
      if (findEmergencyData === null) {
        return res.status(204).send({ error: false, message: "Emergency data not found" });
      }

      res.status(200).send({
        error: false,
        message: "Find emergency data success",
        data: findEmergencyData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // create emergency
  createEmergency: async (req, res) => {
    try {
      const { jenis_kejadian, deskripsi, lat, lng } = req.body;
      const foto_emergency = req.files["foto_emergency"] ? req.files["foto_emergency"][0].filename : null;

      const userId = req.userId;

      //check require fields
      if (!jenis_kejadian || !deskripsi || !lat || !lng) {
        // return error message with name of empty field
        return res.status(400).send({
          error: true,
          message: "Harap sertakan jenis_kejadian, deskripsi, dan lokasi",
        });
      }

      const data = {
        id_pengguna: userId,
        jenis_kejadian,
        foto: foto_emergency,
        deskripsi,
        status: "open",
        lat,
        lng,
      };

      const createEmergency = await services.emergency.createEmergency(data);
      console.log(createEmergency, "createEmergency");
      const notifyAgent = services.socket.sendEmergencyAlertToRole(2, "emergency_incident");
      const newNotificationUser = services.socket.sendNotification(userId, "new_notification");
      res.status(201).send({
        error: false,
        message: "Emergency created successfully",
        data: createEmergency,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // update emergency
  updateEmergency: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
      // check if id value is empty
      if (!id) {
        return res.status(400).send({ error: true, message: "Id is required" });
      }

      const data = {
        status: "closed",
        agent_id: userId,
      };

      const criteria = {
        name: "id",
        value: id,
      };

      const updateEmergencyData = await services.emergency.updateEmergency(criteria, data);
      if (updateEmergencyData[0] === 0) {
        return res.status(204).send({ error: false, message: "Emergency data not found" });
      }

      res.status(200).send({
        error: false,
        message: "Emergency data updated",
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // write emergency view log
  writeEmergencyViewLog: async (req, res) => {
    try {
      const { emergency_id } = req.body;
      const userId = req.userId;

      // check if id value is empty
      if (!emergency_id) {
        return res.status(400).send({ error: true, message: "Emergency id is required" });
      }

      const data = {
        agent_id: userId,
        emergency_id: emergency_id,
      };

      const createEmergencyViewLog = await services.emergency.createEmergencyViewLog(data);
      res.status(201).send({
        error: false,
        message: "Emergency view log created successfully",
        data: createEmergencyViewLog,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  broadcastEmergency: async (req, res) => {
    try {
      const testing = services.socket.sendNotification(7, "new_notification");

      res.send("ok");
    } catch (error) {}
  },
};
