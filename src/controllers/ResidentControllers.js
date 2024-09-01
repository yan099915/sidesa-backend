const services = require("../services");
const { SECRET_KEY } = process.env;

module.exports = {
  getAllResidents: async (req, res) => {
    try {
      const { page, limit, search, dusun } = req.query;

      const findResidentData = await services.resident.getAllResidents(page, limit, search, dusun);
      if (findResidentData.length === 0) {
        return res.status(204).send({ error: false, message: "Resident data not found" });
      }

      res.status(200).send({
        error: false,
        message: "Find resident data success",
        data: findResidentData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  findResidents: async (req, res) => {
    try {
      const { nik } = req.params;
      // check if nik value is empty
      if (!nik) {
        return res.status(400).send({ error: true, message: "Nik is required" });
      }
      console.log(nik, "nik", typeof nik);
      const findResidentData = await services.resident.findResidents({ name: "nomor_ktp", value: nik.toString() });

      // console.log(findResidentData, "findResidentData");
      if (findResidentData === null) {
        return res.status(204).send({ error: true, message: "Resident data not found" });
      }

      res.status(200).send({
        error: false,
        message: "Resident data found",
        data: findResidentData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // add new resident data
  createResident: async (req, res) => {
    try {
      // all data is required
      const {
        nomor_ktp,
        nomor_kk,
        nama,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        alamat,
        agama,
        status_perkawinan,
        golongan_darah,
        pekerjaan,
        rt,
        rw,
        dusun,
      } = req.body;

      // check any required data is empty
      const requiredFields = [
        "nomor_ktp",
        "nomor_kk",
        "nama",
        "jenis_kelamin", // add this line
        "tempat_lahir",
        "tanggal_lahir",
        "alamat",
        "agama",
        "status_perkawinan",
        "golongan_darah",
        "pekerjaan",
        "rt",
        "rw",
        "dusun",
      ];
      let missingFields = [];

      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(field);
        }
      });

      if (missingFields.length) {
        return res.status(400).send({ error: true, message: `The following fields are required: ${missingFields.join(", ")}` });
      }

      // check if nik is already exist
      const findResidentData = await services.resident.findResidents({ name: "nomor_ktp", value: nomor_ktp });

      // if nik is already exist
      if (findResidentData !== null) {
        return res.status(400).send({ error: true, message: "Nik already used" });
      }

      const data = {
        nomor_ktp,
        nomor_kk,
        nama,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        alamat,
        agama,
        status_perkawinan,
        golongan_darah,
        pekerjaan,
        rt,
        rw,
        dusun,
      };

      // create new resident data
      const newResidentData = await services.resident.createResident(data);
      // console.log(newResidentData.dataValues, "newResidentData");

      if (newResidentData === null) {
        return res.status(400).send({ error: true, message: "Failed to add resident data" });
      }

      res.status(201).send({
        error: false,
        message: "Add resident data success",
        data: newResidentData.dataValues,
      });
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // update resident data
  updateResident: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nomor_ktp,
        nomor_kk,
        nama,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        alamat,
        agama,
        status_perkawinan,
        golongan_darah,
        pekerjaan,
        rt,
        rw,
        dusun,
      } = req.body;

      // check if id value is empty
      if (!id) {
        return res.status(400).send({ error: true, message: "Id is required" });
      }

      const findResidentData = await services.resident.findResidents({ name: "id", value: id });
      // console.log(findResidentData, "findResidentData");
      if (findResidentData === null) {
        return res.status(204).send({ error: false, message: "Resident data not found" });
      }

      const data = {
        nomor_ktp,
        nomor_kk,
        nama,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        alamat,
        agama,
        status_perkawinan,
        golongan_darah,
        pekerjaan,
        rt,
        rw,
        dusun,
      };

      // update resident data
      const updateResidentData = await services.resident.updateResident(data, { name: "id", value: id });
      // console.log(updateResidentData, "updateResidentData");

      if (updateResidentData[0] === 0) {
        return res.status(400).send({ error: true, message: "Failed to update resident data" });
      }

      res.status(200).send({
        error: false,
        message: "Update resident data success",
        data: data,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // delete resident data
  deleteResident: async (req, res) => {
    try {
      console.log(req.params);
      const { id } = req.params;

      // check if id value is empty
      if (!id) {
        return res.status(400).send({ error: true, message: "Id is required" });
      }

      const findResidentData = await services.resident.findResidents({ name: "id", value: id });
      // console.log(findResidentData, "findResidentData");
      if (findResidentData === null) {
        return res.status(204).send({ error: false, message: "Resident data not found" });
      }

      // delete resident data
      const deleteResidentData = await services.resident.deleteResident({ name: "id", value: id });
      // console.log(deleteResidentData, "deleteResidentData");

      if (deleteResidentData === 0) {
        return res.status(400).send({ error: true, message: "Failed to delete resident data" });
      }

      res.status(200).send({
        error: false,
        message: "Delete resident data success",
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};
