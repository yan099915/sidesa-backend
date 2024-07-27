const { Penduduk, Keluarga, sequelize } = require("../models");
const { Op, where } = require("sequelize");
module.exports = {
  //   get all residents
  getAllResidents: async (page, pageSize, search) => {
    try {
      // Set default values for page and pageSize
      if (!page || !pageSize) {
        page = 1;
        pageSize = 10;
      }

      const offset = (page - 1) * pageSize;

      // Create a dynamic where object based on filters provided
      const where = {};

      // If filters contains a search query, apply it to multiple fields
      if (search) {
        where[Op.or] = [
          { nama: { [Op.like]: `%${search}%` } },
          { nomor_ktp: { [Op.like]: `%${search}%` } },
          { nomor_kk: { [Op.like]: `%${search}%` } },
        ];
      }

      //   count total residents
      const totalResidents = await Penduduk.count({
        where: where,
      });

      const residents = await Penduduk.findAll({
        attributes: ["id", "nama", "nomor_ktp", "nomor_kk"], // Ensure these attributes are included
        order: [["created_at", "DESC"]],
        limit: Number(pageSize),
        offset: Number(offset),
        where: where, // Use the dynamic where object
      });

      // calculate total pages
      const totalPages = Math.ceil(totalResidents / pageSize);

      return {
        residents: residents,
        currentPage: Number(page),
        totalPages: totalPages,
      };
    } catch (error) {
      return error;
    }
  },

  // find resident by dynamic criteria
  findResidents: async (criteria) => {
    try {
      // find resident with dynamic criteria
      const findResident = await Penduduk.findOne({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
        // attributes: {
        //   exclude: ["createdAt", "updatedAt"],
        // },
        include: [
          {
            model: Keluarga,
            as: "keluarga",
            attributes: ["nomor_kk"],
          },
        ],
      });

      return findResident;
    } catch (error) {
      console.log(error, "error");
      return error;
    }
  },

  //   create new resident
  createResident: async (data) => {
    try {
      // make transactional process to create new penduduk
      const createResident = await sequelize.transaction(async (t) => {
        // check if any data is exist with data.nomor_ktp
        const findResident = await Penduduk.findOne({
          where: {
            nomor_ktp: {
              [Op.eq]: data.nomor_ktp,
            },
          },
        });

        if (findResident !== null) {
          console.log("exist");
          return { error: true, message: "Nik already exist" };
        }

        const resident = await Penduduk.create(data, { transaction: t });
        return resident;
      });
      return createResident;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  //   update resident by dynamic criteria
  updateResident: async (criteria, data) => {
    try {
      // update resident with dynamic criteria
      const updateResident = await Penduduk.update(data, {
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
      });
      return updateResident;
    } catch (error) {
      return error;
    }
  },
};
