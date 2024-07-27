const { Pengguna, Penduduk } = require("../models/index");
const { Op, where } = require("sequelize");
module.exports = {
  // find user by dynamic criteria
  findUsers: async (criteria) => {
    try {
      // console.log(criteria, "criteria");
      // find user with dynamic criteria
      const findUser = await Pengguna.findOne({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
        include: [
          {
            model: Penduduk,
            as: "penduduk",
            attributes: ["nomor_kk"],
          },
        ],
      });

      return findUser;
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  },

  // find verified user by dynamic criteria
  findVerifiedUsers: async (nomor_ktp) => {
    try {
      // check if nomor_ktp is already been used by another pengguna
      const findPenggunaByNomorKtp = await Pengguna.findOne({
        where: {
          [Op.and]: [{ nomor_ktp: nomor_ktp }, { verified: true }],
        },
      });

      return findPenggunaByNomorKtp;
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  },

  // create new user
  createUser: async (data) => {
    try {
      const newUser = await Pengguna.create(data);
      return newUser;
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  },

  // update user by dynamic criteria
  updateUser: async (criteria, data) => {
    try {
      // update user with dynamic criteria
      const updateUser = await Pengguna.update(data, {
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
      });
      return updateUser;
    } catch (error) {
      return error;
    }
  },

  // user save session
  saveSession: async (criteria, data) => {
    try {
      // update user with dynamic criteria
      const updateUser = await Pengguna.update(data, {
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
      });
      return updateUser;
    } catch (error) {
      return error;
    }
  },

  // user check session
  checkSession: async (criteria) => {
    try {
      // update user with dynamic criteria
      const checkSession = await Pengguna.findOne({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
      });
      return checkSession;
    } catch (error) {
      return error;
    }
  },

  // user notification list
  userNotifications: async (criteria) => {
    try {
      // get all notification data
      const allNotifications = await Pengguna.findAll({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
        attributes: ["id", "nama", "email", "role", "status", "created_at"],
      });

      return allNotifications;
    } catch (error) {
      return error;
    }
  },
};
