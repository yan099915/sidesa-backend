const bcrypt = require("bcrypt");
const services = require("../services");
const { createRequest } = require("../services/RequestServices");

module.exports = {
  // get request list
  getRequests: async (req, res) => {
    try {
      const { page, limit, search, jenis_pengajuan, status_pengajuan, jenis_ttd } = req.query;
      const userId = req.userId;

      const findRequestData = await services.request.requestList(page, limit, search, status_pengajuan, jenis_pengajuan, jenis_ttd);
      if (findRequestData.length === 0) {
        return res.status(204).send({ error: false, message: "Request data not found" });
      }

      // console.log(findRequestData, "findRequestData");

      res.status(200).send({
        error: false,
        message: "Find request data success",
        data: findRequestData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // get user requests
  getUserRequests: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const userId = req.userId;

      console.log(req.userId, "req.userId");

      const findRequestData = await services.request.userRequests(page, limit, (criteria = { name: "id_pengguna", value: userId }));

      // console.log(findRequestData, "findRequestData");
      if (findRequestData.length === 0) {
        return res.status(204).send({ error: false, message: "Request data not found" });
      }

      res.status(200).send({
        error: false,
        message: "Find request data success",
        data: findRequestData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // get request details
  requestDetails: async (req, res) => {
    try {
      const { id } = req.query;
      // check if id value is empty
      if (!id) {
        return res.status(400).send({ error: true, message: "Id is required" });
      }

      const findRequestData = await services.request.findRequests({ name: "id", value: id });
      // console.log(findRequestData, "findRequestData");
      if (findRequestData === null) {
        console.log("masuk ke null");
        return res.status(204).send({ error: false, message: "Request data not found" });
      }

      res.status(200).send({
        error: false,
        message: "Request data found",
        data: findRequestData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // add new request data
  createRequest: async (req, res) => {
    try {
      // all data is required
      const {
        jenis_pengajuan,
        keterangan,
        nomor_ktp,
        nomor_kk,
        anggota_keluarga,
        jam_kematian,
        tanggal_kematian,
        tempat_kematian,
        tanggal_pemakaman,
        jenis_ttd,
        tempat_pemakaman,
      } = req.body;
      const userId = req.userId;
      const surat_rs = req.files["surat_rs"] ? req.files["surat_rs"][0].filename : null;
      let missingFields = [];

      if (!userId) {
        return res.status(400).send({ error: true, message: "Unauthorized" });
      }

      if (!jenis_pengajuan) missingFields.push("jenis_pengajuan");
      if (!keterangan) missingFields.push("keterangan");
      if (!nomor_ktp) missingFields.push("nomor_ktp");
      if (!nomor_kk) missingFields.push("nomor_kk");

      if (missingFields.length > 0) {
        return res.status(400).send({
          error: true,
          message: "Some fields are missing",
          missingFields: missingFields,
        });
      }

      const reqData = {
        nomor_ktp: nomor_ktp,
        id_pengguna: userId,
        jenis_pengajuan: jenis_pengajuan,
        keterangan: keterangan,
        status_pengajuan: 1, //status default adalah Menunggu
        anggota_keluarga: anggota_keluarga,
        jenis_ttd: jenis_ttd,
      };

      switch (jenis_pengajuan) {
        case "1":
          // membuat surat keterangan domisili
          const createSuratDomisili = await services.request.createRequest(reqData);

          res.status(201).send({
            error: false,
            message: "Create request data success",
            data: createSuratDomisili,
          });
          break;
        case "2":
          // membuat request surat keterangan kelahiran
          if (!surat_rs) {
            return res.status(400).send({ error: true, message: "Foto RS is required" });
          }

          const suratKelahiranData = {
            surat_rs: surat_rs,
            nama_anak: req.body.nama_anak,
            tempat_lahir: req.body.tempat_lahir,
            tanggal_lahir: req.body.tanggal_lahir,
            jam_lahir: req.body.jam_lahir,
            jenis_kelamin: req.body.jenis_kelamin,
            anggota_keluarga: anggota_keluarga,
          };

          //   join surat kematian data with request data
          const RequestData = { ...reqData, ...suratKelahiranData };
          console.log(RequestData, "RequestData");

          const createSuratKelahiran = await services.request.createRequest(RequestData);

          if (createSuratKelahiran.error) {
            return res.status(400).send({ error: true, message: createSuratKelahiran.message });
          }

          res.status(201).send({
            error: false,
            message: "Create request data success",
            data: createSuratKelahiran,
          });
          break;
        case "3":
          // membuat request surat keterangan kematian
          if (!surat_rs) {
            return res.status(400).send({ error: true, message: "Foto RS is required" });
          }

          const suratKematianData = {
            surat_rs: surat_rs,
            jam_kematian: jam_kematian,
            tanggal_kematian: tanggal_kematian,
            anggota_keluarga: anggota_keluarga,
            tempat_kematian: tempat_kematian,
            tanggal_pemakaman: tanggal_pemakaman,
            tempat_pemakaman: tempat_pemakaman,
          };

          //   join surat kematian data with request data
          const newRequestData = { ...reqData, ...suratKematianData };

          const createSuratKematian = await services.request.createRequest(newRequestData);

          // remove uploaded image if request createSuratKematian failed
          // const destFile = req.files["surat_rs"][0].path;
          // fs.unlink(destFile, (err) => {
          //   if (err) {
          //     console.log(err, "err");
          //   }
          // });

          res.status(201).send({
            error: false,
            message: "Create request data success",
            data: createSuratKematian,
          });

          //   const createSuratKelahiran = await services.request.(reqData);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // update request data
  updateRequest: async (req, res) => {
    try {
      const { id, status_pengajuan } = req.body;
      const surat = req.files["surat"] ? req.files["surat"][0].filename : null;
      const userId = req.userId;

      console.log(surat, "reqbody");
      // console.log(req);

      if (!userId) {
        return res.status(400).send({ error: true, message: "Unauthorized" });
      }

      if (!id) {
        return res.status(400).send({ error: true, message: "Id is required" });
      }

      if (!status_pengajuan) {
        return res.status(400).send({ error: true, message: "Status pengajuan is required" });
      }

      const findRequestData = await services.request.findRequests({ name: "id", value: id });

      if (findRequestData === null) {
        return res.status(204).send({ error: false, message: "Request data not found" });
      }

      const updateRequestData = await services.request.updateRequest(
        { name: "id", value: id },
        {
          status_pengajuan: status_pengajuan,
          surat: surat,
          jenis_pengajuan: findRequestData.jenis_pengajuan,
          id_pengguna: findRequestData.id_pengguna,
        }
      );

      if (updateRequestData === null) {
        return res.status(400).send({ error: true, message: "Failed to update request data" });
      }

      const newNotificationUser = services.socket.sendNotification(findRequestData.id_pengguna, "new_notification");
      res.status(200).send({
        error: false,
        message: "Update request data success",
        data: updateRequestData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};
