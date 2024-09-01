const { Verification, VerificationStatus, Notification, Penduduk, Pengguna, Keluarga, sequelize } = require("../models/index");
const { Op, where } = require("sequelize");
const logger = require("../common/logger");

module.exports = {
  // find user by dynamic criteria
  findVerifications: async (criteria) => {
    try {
      // console.log(criteria, "criteria");
      // find user with dynamic criteria
      const findVerification = await Verification.findOne({
        // attributes: {exclude: ['status', "agent_id"]},
        where: {
          [criteria.name]: {
            [Op.eq]: Number(criteria.value),
          },
        },
        include: [{ model: VerificationStatus, as: "verification_status", attributes: ["id", "name"] }],
      });

      return findVerification;
    } catch (error) {
      throw error;
    }
  },

  //  get all verification request data
  getAllVerifications: async (page, pageSize) => {
    try {
      // if page and pageSize is empty set it into default value
      if (!page || !pageSize) {
        page = 1;
        pageSize = 10;
      }

      // console.log(page, typeof pageSize, "page and pageSize");

      const offset = (page - 1) * pageSize;

      // get total count of verifications
      const totalVerifications = await Verification.count();

      // get all verification data with pagination
      const allVerifications = await Verification.findAll({
        attributes: ["id", "nama", "status", "agent_id", "notes", "created_at", "updated_at"], // Ensure these attributes are included
        order: [["created_at", "DESC"]],
        include: [{ model: VerificationStatus, as: "verification_status", attributes: ["id", "name"] }],
        limit: Number(pageSize),
        offset: Number(offset),
      });

      // calculate total pages
      const totalPages = Math.ceil(totalVerifications / pageSize);

      return {
        verifications: allVerifications,
        currentPage: Number(page),
        totalPages: totalPages,
      };
    } catch (error) {
      return error;
    }
  },

  // create new user
  createVerification: async (data) => {
    try {
      // check if user is already have verification request
      const findVerification = await Verification.findOne({
        where: {
          id_pengguna: {
            [Op.eq]: data.id_pengguna,
          },
        },
      });

      if (findVerification) {
        if (!data.foto_kk) {
          data.foto_kk = findVerification.foto_kk;
        }

        if (!data.foto_ktp) {
          data.foto_ktp = findVerification.ktp;
        }

        data.status = 1;
        data.notes = null;

        // update data yang sudah ada dengan data
        const updateVerification = await Verification.update(data, {
          where: {
            id_pengguna: {
              [Op.eq]: data.id_pengguna,
            },
          },
        });

        return updateVerification;
      } else {
        // create new verification data
        const newVerification = await Verification.create(data);
        return newVerification;
      }
    } catch (error) {
      console.log(error, "error");
      return error;
    }
  },

  // update user by dynamic criteria
  updateVerification: async (data) => {
    const transaction = await sequelize.transaction();

    try {
      // find verification data
      const findVerification = await Verification.findOne({
        where: {
          id: {
            [Op.eq]: data.id,
          },
        },
        transaction,
      });

      // console.log(findVerification, "findVerification!!!!!!!!!!!!!!!!!!!!!!!!!");

      if (!findVerification) {
        await transaction.rollback();
        return {
          error: true,
          message: "Verification data not found",
          data: {},
        };
      }

      // find requester pengguna data
      const findPengguna = await Pengguna.findOne({
        where: {
          id: {
            [Op.eq]: findVerification.id_pengguna,
          },
        },
        transaction,
      });

      // console.log(findPengguna, "findPengguna!!!!!!!!!!!!!!!!!!!!!!!!!");
      if (!findPengguna) {
        console.log("rollback !!!!!!!!!!!!!!!");
        await transaction.rollback();
        throw new Error("Pengguna not found");
      }

      // check if nomor_ktp is already been used by another pengguna
      const findPenggunaByNomorKtp = await Pengguna.findOne({
        where: {
          [Op.and]: [{ nomor_ktp: findVerification.nomor_ktp }, { verified: true }],
        },
        transaction,
      });

      // console.log(findPenggunaByNomorKtp, "findPenggunaNoKTP!!!!!!!!!!!!!!!!!!!!!!!!!");
      // console.log(findPenggunaByNomorKtp, "findPenggunaByNomorKtp");

      if (findPenggunaByNomorKtp && findPenggunaByNomorKtp.id !== findVerification.id_pengguna) {
        console.log("rollback !!!!!!!!!!!!!!!");
        await transaction.rollback();
        return {
          error: true,
          message: "Nomor KTP is already been used by another pengguna",
          data: {},
        };
      }

      const updates = {
        status: data.status,
        notes: data.notes,
        agent_id: data.agent_id,
      };

      // update verification data into database
      await Verification.update(updates, {
        where: {
          id: {
            [Op.eq]: data.id,
          },
        },
        transaction,
      });

      const findPenduduk = await Penduduk.findOne({
        where: {
          nomor_ktp: {
            [Op.eq]: findVerification.nomor_ktp,
          },
        },
        transaction,
      });

      // console.log(findPenduduk, "findPenduduk!!!!!!!!!!!!!!!!!!!!!!!!!");

      //remove id from findVerification.get()
      delete findVerification.get().id;
      // console.log(findVerification.get(), "findVerification.get()");

      // status 2 is accepted
      if (findPenduduk === null && data.status === 2) {
        console.log("CREATE PENDUDUK");
        await Penduduk.create(findVerification.get(), { transaction });
        await Keluarga.create({ nomor_kk: findVerification.nomor_kk, rt: findVerification.rt, rw: findVerification.rw }, { transaction });
      } else if (findPenduduk !== null && data.status === 2) {
        await Keluarga.create({ nomor_kk: findVerification.nomor_kk, rt: findVerification.rt, rw: findVerification.rw }, { transaction });
        console.log("UPDATE PENDUDUK");
        await Penduduk.update(findVerification.get(), {
          where: {
            nomor_ktp: {
              [Op.eq]: findVerification.nomor_ktp,
            },
          },
          transaction,
        });
      }

      // jika requestnya berstatus 2 alias verifikasi sudah di terima
      if (data.status === 2) {
        await Pengguna.update(
          { verified: true, nomor_ktp: findVerification.nomor_ktp },
          {
            where: {
              id: {
                [Op.eq]: findVerification.id_pengguna,
              },
            },
            transaction,
          }
        );
      } else {
        await Pengguna.update(
          { nomor_ktp: findVerification.nomor_ktp },
          {
            where: {
              id: {
                [Op.eq]: findVerification.id_pengguna,
              },
            },
            transaction,
          }
        );
      }

      // create notification for user
      const newNotification = {
        id_pengguna: findVerification.id_pengguna,
        title: "Verification Request",
        message: `Your verification request has been ${data.status === 2 ? "accepted" : "rejected"}`,
        type: "verification",
        status: "unread",
        url: "/profile",
      };

      await Notification.create(newNotification, { transaction });

      await transaction.commit();
      return {
        error: false,
        message: "Verification data updated successfully",
        data: updates,
      };
    } catch (error) {
      await transaction.rollback();
      // logger.info(error);
      console.log(error, "WERRORNYA");
      throw error;
    }
  },
};
