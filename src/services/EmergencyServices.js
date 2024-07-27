// import model
const { Op } = require("sequelize");
const { Emergency, Pengguna, Penduduk, EmergencyViewLog, Notification, sequelize } = require("../models");

module.exports = {
  // get emergency list
  getEmergencies: async (page, limit, search, jenis_kejadian, status_kejadian) => {
    try {
      //
      if (!page || !limit) {
        page = 1;
        pageSize = 10;
      }

      const offset = page * limit - limit;

      const where = {};

      // If filters contains a search query, apply it to multiple fields
      if (search) {
        where[Op.or] = [
          { id: { [Op.like]: `%${search}%` } },
          //   { nomor_ktp: { [Op.like]: `%${search}%` } },
          //   { nomor_kk: { [Op.like]: `%${search}%` } },
        ];
      }

      // jika tidak ada search query jenis_kejadian dan status_kejadian cari semua data

      const findEmergencyData = await Emergency.findAndCountAll({
        where: where,
        attributes: ["id", "status", "jenis_kejadian"], // Ensure these attributes are included
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset: offset,
      });
      return {
        insident: findEmergencyData.rows,
        totalItems: findEmergencyData.count,
        totalPages: Math.ceil(findEmergencyData.count / limit),
        currentPage: Number(page),
      };

      //   const findEmergencyData = await Emergency.findAndCountAll({
      //     where: where,
      //     limit: parseInt(limit),
      //     offset: offset,
      //   });
      //   return {
      //     data: findEmergencyData.rows,
      //     totalItems: findEmergencyData.count,
      //     totalPages: Math.ceil(findEmergencyData.count / limit),
      //     currentPage: Number(page),
      //   };
    } catch (error) {
      //   console.log(error, "error");
      throw error;
    }
  },

  // create emergency
  createEmergency: async (data) => {
    try {
      const newEmergency = await Emergency.create(data);

      // create notification for user
      const newNotification = {
        id_pengguna: data.id_pengguna,
        title: "Emergency Message",
        message: `Your emergency message has been sent`,
        type: "emergency",
        status: "unread",
        url: "/",
      };

      await Notification.create(newNotification);
      return newEmergency;
    } catch (error) {
      console.log(error, "ERROR");
      //   await transaction.rollback();
      throw error;
    }
  },

  //   get emergency details
  getEmergencyDetails: async (criteria) => {
    try {
      const findEmergency = await Emergency.findOne({
        where: {
          [criteria.name]: criteria.value,
        },
        attributes: ["id", "status", "jenis_kejadian", "deskripsi", "lat", "lng", "foto", "agent_id", "created_at", "updated_at"],
        include: [
          {
            model: Pengguna,
            as: "pengguna",
            attributes: ["id", "email", "nomor_ktp"],
          },
          {
            model: Pengguna,
            as: "agent",
            attributes: ["id", "email"],
          },
          {
            model: EmergencyViewLog,
            as: "view_log",
            attributes: ["id", "emergency_id", "agent_id", "created_at"],
            include: [
              {
                model: Pengguna,
                as: "agent",
                attributes: ["id", "email"],
              },
            ],
          },
        ],
      });
      return findEmergency;
    } catch (error) {
      //   console.log(error, "error");
      throw error;
    }
  },

  //   update emergency
  updateEmergency: async (criteria, data) => {
    try {
      const updateEmergency = await Emergency.update(data, {
        where: {
          [criteria.name]: criteria.value,
        },
      });
      return updateEmergency;
    } catch (error) {
      throw error;
    }
  },

  //   delete emergency
  deleteEmergency: async (criteria) => {
    try {
      const deleteEmergency = await Emergency.destroy({
        where: {
          [criteria.name]: criteria.value,
        },
      });
      return deleteEmergency;
    } catch (error) {
      return error;
    }
  },

  // emergency view log
  createEmergencyViewLog: async (data) => {
    try {
      const createEmergencyViewLog = await EmergencyViewLog.create(data);
      return createEmergencyViewLog;
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  },
};
