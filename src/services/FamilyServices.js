const { Keluarga, Penduduk } = require("../models");
const { Op, where } = require("sequelize");
module.exports = {
  getFamilyDetails: async (criteria) => {
    try {
      const family = await Keluarga.findOne({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Penduduk,
            as: "anggota_keluarga",
            attributes: ["id", "nama", "alamat", "nomor_ktp"],
          },
        ],
      });

      console.log;
      return family;
    } catch (error) {
      return error;
    }
  },
};
