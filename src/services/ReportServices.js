const { Pengajuan, Penduduk, Emergency, Sequelize } = require("../models");
const { Op, where } = require("sequelize");

module.exports = {
  getPortalReports: async (year) => {
    try {
      // Count data per month in specific year using sequelize
      const yearFilter = year ? year : 2024;
      const RequestData = await Pengajuan.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
          [Sequelize.fn("SUM", Sequelize.literal(`CASE WHEN status_pengajuan = 3 THEN 1 ELSE 0 END`)), "total_terselesaikan"],
        ],
        where: Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("created_at")), yearFilter),
        group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
        raw: true,
      });

      const EmergencyData = await Emergency.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
          [Sequelize.fn("SUM", Sequelize.literal(`CASE WHEN status = 'closed' THEN 1 ELSE 0 END`)), "total_terselesaikan"],
        ],
        where: Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("created_at")), yearFilter),
        group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
        raw: true,
      });

      return { RequestData, EmergencyData };
    } catch (error) {
      console.log(error, "ini errorny");
      throw new Error(error);
    }
  },

  getResidentReports: async (dusun) => {
    try {
      const today = new Date();
      const minDateOfBirth = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
      const maxDateOfBirth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

      // Create a dynamic where object based on filters provided
      const where = {};

      if (dusun) {
        where.dusun = dusun;
      }

      // Count data per month in specific year using sequelize and grouping by gender
      const PendudukData = await Penduduk.findAll({
        attributes: [
          // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
          [Sequelize.col("jenis_kelamin"), "label"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
        ],
        where: where,
        group: ["label"],
      });

      // Create a dynamic where object based on filters provided
      const whereUsiaPenduduk = {
        tanggal_lahir: {
          [Op.not]: null,
        },
      };

      if (dusun) {
        whereUsiaPenduduk.dusun = dusun;
      }

      // Hitung penduduk berdasarkan rentang usia
      const PendudukUsia = await Penduduk.findAll({
        attributes: [
          [
            Sequelize.literal(`
      CASE 
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) < 18 THEN '0-17'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 26 AND 35 THEN '26-35'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 36 AND 45 THEN '36-45'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 46 AND 60 THEN '46-60'
        ELSE '60+'
      END
    `),
            "label",
          ],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
        ],
        group: ["label"],
        where: whereUsiaPenduduk,
      });

      const wherePendudukTidakBekerja = {
        pekerjaan: {
          [Op.eq]: "Belum / Tidak Bekerja",
        },
        tanggal_lahir: {
          [Op.between]: [minDateOfBirth, maxDateOfBirth],
        },
      };

      if (dusun) {
        wherePendudukTidakBekerja.dusun = dusun;
      }

      // Count data penduduk where calculated tanggal_lahir is between 18-60 years old
      const PendudukTidakBekerja = await Penduduk.findAll({
        attributes: [
          [
            Sequelize.literal(`
      CASE 
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) < 18 THEN '0-17'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 26 AND 35 THEN '26-35'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 36 AND 45 THEN '36-45'
        WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 46 AND 60 THEN '46-60'
        ELSE '60+'
      END
    `),
            "label",
          ],
          [Sequelize.col("jenis_kelamin"), "label_2"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
        ],
        group: ["label", "label_2"],
        where: wherePendudukTidakBekerja,
      });

      return { PendudukData, PendudukTidakBekerja, PendudukUsia };
    } catch (error) {
      console.log(error, "ini errornya");
      throw new Error(error);
    }
  },

  getResidentGenderReports: async (req, res) => {
    try {
      const year = 2024; // atau ambil dari req.query jika perlu

      // Count data per month in specific year using sequelize and grouping by gender
      const PendudukData = await Penduduk.findAll({
        attributes: [
          // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
          [Sequelize.col("jenis_kelamin"), "gender"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
        ],
        // where: Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("created_at")), year),
        group: [Sequelize.fn("MONTH", Sequelize.col("created_at")), "gender"],
      });

      // Count data per month in specific year where status is 3 and grouping by gender
      const PendudukDone = await Penduduk.findAll({
        attributes: [
          // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
          [Sequelize.col("jenis_kelamin"), "gender"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
        ],
        where: {
          // status_penduduk: 3, // Uncomment if needed
          created_at: {
            // [Sequelize.Op.and]: [Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("created_at")), year)],
          },
        },
        group: [Sequelize.fn("MONTH", Sequelize.col("created_at")), "gender"],
      });

      // Combine data and return

      return PendudukData;
    } catch (error) {
      console.log(error, "ini errornya");
      throw new Error(error);
    }
  },
};
