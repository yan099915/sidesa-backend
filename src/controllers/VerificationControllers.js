const services = require("../services");
const logger = require("../common/logger");
const moment = require("moment");

module.exports = {
  // request data verification
  requestDataVerification: async (req, res) => {
    try {
      const {
        ktpNumber,
        kkNumber,
        name,
        jenis_kelamin,
        birthDate,
        birthPlace,
        address,
        lat,
        lng,
        religion,
        gdarah,
        maritalStatus,
        hubungan,
        job,
        pendidikan,
        rt,
        rw,
        dusun,
      } = req.body;

      const foto_diri = req.files["foto_diri"] ? req.files["foto_diri"][0].filename : null;
      const foto_ktp = req.files["foto_ktp"] ? req.files["foto_ktp"][0].filename : null;
      const foto_kk = req.files["foto_kk"] ? req.files["foto_kk"][0].filename : null;

      // check if user not found
      const findUserByCriteria = await services.users.findUsers({ name: "id", value: req.userId });
      if (findUserByCriteria === null) {
        return res.status(404).send({ error: true, message: "User not found", data: {} });
      }

      //check if already user has verified status with the same nomor_ktp or nomor_kk
      const findPenggunaByNomorKtp = await services.users.findVerifiedUsers({ name: "nomor_ktp", value: ktpNumber });
      if (findPenggunaByNomorKtp && findPenggunaByNomorKtp.id !== findUserByCriteria.id) {
        return res.status(400).send({ error: true, message: "Nomor KTP sudah digunakan", data: {} });
      }

      const findPenggunaByNomorKK = await services.users.findVerifiedUsers({ name: "nomor_kk", value: kkNumber });
      if (findPenggunaByNomorKK && findPenggunaByNomorKK.id !== findUserByCriteria.id) {
        return res.status(400).send({ error: true, message: "Nomor KK sudah digunakan", data: {} });
      }

      // insert verification data
      const insertVerificationData = await services.verification.createVerification({
        foto_diri,
        foto_ktp,
        foto_kk,
        nomor_ktp: ktpNumber,
        nomor_kk: kkNumber,
        nama: name.toUpperCase(),
        jenis_kelamin: jenis_kelamin.toUpperCase(),
        tanggal_lahir: moment(birthDate).format("YYYY-MM-DD"),
        tempat_lahir: birthPlace.toUpperCase(),
        alamat: address.toUpperCase(),
        lat: lat,
        lng: lng,
        agama: religion.toUpperCase(),
        status_perkawinan: maritalStatus,
        hubungan_keluarga: hubungan,
        pekerjaan: job,
        pendidikan: pendidikan,
        rt,
        rw,
        dusun,
        golongan_darah: gdarah.toUpperCase(),
        id_pengguna: findUserByCriteria.id,
        status: 1,
      });

      res.send({ error: false, message: "Request data verification success", data: insertVerificationData });
    } catch (error) {
      console.log(error, "error requestDataVerification");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  // check verification status
  checkVerificationStatus: async (req, res) => {
    try {
      // console.log(req.userId, "req.userId");
      const findVerificationByCriteria = await services.verification.findVerifications({ name: "id_pengguna", value: req.userId });

      // console.log(findVerificationByCriteria, "findVerificationByCriteria");
      if (findVerificationByCriteria === null) {
        return res.status(204).send({ error: false, message: "Verification data not found", data: {} });
      }

      res.status(200).send({
        error: false,
        message: "Verification data found",
        data: findVerificationByCriteria,
      });
    } catch (error) {
      console.log(error, "error checkVerificationStatus");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  //  get all verifications
  getAllVerifications: async (req, res) => {
    try {
      const { page, limit } = req.query;

      const allVerifications = await services.verification.getAllVerifications(page, limit);

      res.send({ error: false, message: "All verifications found", data: allVerifications });
    } catch (error) {
      console.log(error, "error getAllVerifications");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  // get verification details
  getVerificationDetails: async (req, res) => {
    try {
      const { id } = req.query;

      const findVerificationByCriteria = await services.verification.findVerifications({ name: "id", value: id });

      if (findVerificationByCriteria === null) {
        return res.status(404).send({ error: true, message: "Verification data not found", data: {} });
      }

      res.status(200).send({ error: false, message: "Verification data found", data: findVerificationByCriteria });
    } catch (error) {
      console.log(error, "error getVerificationDetails");
      res.status(500).send({ error: true, message: "Internal server error", data: {} });
    }
  },

  approveVerification: async (req, res) => {
    try {
      const { id, notes, status } = req.body;
      //   check if id notes and status is empty
      if (!id || !notes || !status) {
        return res.status(400).send({ error: true, message: "Id, notes and status are required", data: {} });
      }

      // logger.info(`${id}, ${notes}, ${status} "approveVerification"`);

      // check if verification data not found
      const findVerificationByCriteria = await services.verification.findVerifications({ name: "id", value: id });
      // logger.info(`${findVerificationByCriteria} "findVerificationByCriteria"`);
      if (findVerificationByCriteria === null) {
        return res.status(404).send({ error: true, message: "Verification data not found", data: {} });
      }

      const data = { id: id, status: status, notes: notes, agent_id: req.userId };
      const updateVerificationData = await services.verification.updateVerification(data);
      const newNotificationUser = services.socket.sendNotification(findVerificationByCriteria.id_pengguna, "new_notification");
      // logger.info(`${updateVerificationData} "updateVerificationData"`);
      res.status(200).send({ error: false, message: "Verification data updated", data: updateVerificationData });
    } catch (error) {
      console.log(error, "ERRORRRR approveVerification");
      res.status(500).send({ error: true, message: "Internal server error", data: error });
    }
  },
};
