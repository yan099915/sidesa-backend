const {
  SuratDomisili,
  SuratKematian,
  SuratKelahiran,
  JenisPengajuan,
  StatusPengajuan,
  Pengajuan,
  Pengguna,
  Penduduk,
  JenisTTD,
  Notification,
  sequelize,
} = require("../models");
const { Op, where } = require("sequelize");
module.exports = {
  userRequests: async (page, pageSize, criteria) => {
    try {
      // if page and pageSize is empty set it into default value
      if (!page || !pageSize) {
        page = 1;
        pageSize = 10;
      }

      const offset = (page - 1) * pageSize;

      // get total count of requests
      const totalRequests = await Pengajuan.count();

      // get all request data with pagination
      const allRequests = await Pengajuan.findAll({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        }, // Use the dynamic where object
        attributes: ["id", "id_pengguna", "jenis_pengajuan", "status_pengajuan", "jenis_ttd", "agent_id", "created_at", "updated_at"], // Ensure these attributes are included
        include: [
          {
            model: JenisPengajuan,
            as: "type",
            attributes: ["id", "nama"],
          },
          { model: StatusPengajuan, as: "status", attributes: ["id", "nama"] },
        ],
        order: [["created_at", "DESC"]],
        limit: Number(pageSize),
        offset: Number(offset),
      });

      // calculate total pages
      const totalPages = Math.ceil(totalRequests / pageSize);

      return {
        requests: allRequests,
        currentPage: Number(page),
        totalPages: totalPages,
      };
    } catch (error) {
      console.log(error, "error");
      return error;
    }
  },

  requestList: async (page = 1, pageSize = 10, search, status_pengajuan, jenis_pengajuan, jenis_ttd) => {
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;

      const where = {};

      // Add conditions only if they exist
      if (search) {
        where[Op.and] = where[Op.and] || [];
        where[Op.and].push({ id: { [Op.like]: `%${search}%` } });
      }

      if (status_pengajuan) {
        where[Op.and] = where[Op.and] || [];
        where[Op.and].push({ status_pengajuan: { [Op.like]: `%${status_pengajuan}%` } });
      }

      if (jenis_pengajuan) {
        where[Op.and] = where[Op.and] || [];
        where[Op.and].push({ jenis_pengajuan: { [Op.like]: `%${jenis_pengajuan}%` } });
      }

      if (jenis_ttd) {
        where[Op.and] = where[Op.and] || [];
        where[Op.and].push({ jenis_ttd: { [Op.like]: `%${jenis_ttd}%` } });
      }

      // Get total count of requests
      const totalRequests = await Pengajuan.count({ where });

      // Get all request data with pagination
      const allRequests = await Pengajuan.findAll({
        where: where, // Use the dynamic where object
        attributes: ["id", "id_pengguna", "jenis_pengajuan", "jenis_ttd", "status_pengajuan", "agent_id", "created_at", "updated_at"], // Ensure these attributes are included
        include: [
          {
            model: JenisPengajuan,
            as: "type",
            attributes: ["id", "nama"],
          },
          {
            model: StatusPengajuan,
            as: "status",
            attributes: ["id", "nama"],
          },
        ],
        order: [["created_at", "DESC"]],
        limit: Number(pageSize),
        offset: Number(offset),
      });

      // Calculate total pages
      const totalPages = Math.ceil(totalRequests / pageSize);
      // console.log(totalPages, "totalPages");
      return {
        requests: allRequests,
        currentPage: Number(page),
        totalPages: totalPages,
      };
    } catch (error) {
      // console.error(error);
      throw new Error("Failed to fetch requests");
    }
  },

  findRequests: async (criteria) => {
    try {
      console.log(criteria, "criteria");

      // Validate the input criteria
      if (!criteria.name || !criteria.value) {
        throw new Error("Criteria name and value are required");
      }

      // console.log("sampai sini");
      // find request with dynamic criteria
      const findRequest = await Pengajuan.findOne({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
        attributes: ["id", "id_pengguna", "jenis_pengajuan", "jenis_ttd", "status_pengajuan", "agent_id", "keterangan", "created_at", "updated_at"],
        include: [
          {
            model: Pengguna,
            as: "pengguna",
            attributes: ["email"],
            include: [
              {
                model: Penduduk,
                as: "penduduk",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: JenisPengajuan,
            as: "type",
            attributes: {
              exclude: ["id", "createdAt", "updatedAt"],
            },
          },
          {
            model: StatusPengajuan,
            as: "status",
            attributes: {
              exclude: ["id", "createdAt", "updatedAt"],
            },
          },
          {
            model: SuratDomisili,
            as: "surat_domisili",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Penduduk,
                as: "penduduk",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
              {
                model: JenisTTD,
                as: "jenis_tanda_tangan",
                attributes: {
                  exclude: ["id", "createdAt", "updatedAt"],
                },
              },
            ],
          },
          // {
          //   model: SuratKelahiran,
          //   as: "surat_kelahiran",
          //   attributes: {
          //     exclude: ["createdAt", "updatedAt"],
          //   },
          //   include: [
          //     {
          //       model: JenisTTD,
          //       as: "jenis_tanda_tangan",
          //       attributes: {
          //         exclude: ["id", "createdAt", "updatedAt"],
          //       },
          //     },
          //   ],
          // },
          {
            model: SuratKematian,
            as: "surat_kematian",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Penduduk,
                as: "penduduk",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
              {
                model: JenisTTD,
                as: "jenis_tanda_tangan",
                attributes: {
                  exclude: ["id", "createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
      });

      // console.log(findRequest, "asdasdasd");
      return findRequest;
    } catch (error) {
      console.error("Error finding request:", error);
      throw error; // Returning null to indicate that no data was found
    }
  },

  createRequest: async (data) => {
    try {
      const createPengajuan = await sequelize.transaction(async (transaction) => {
        // create new request
        const newRequest = await Pengajuan.create(data, { transaction });

        if (!newRequest) {
          throw new Error("Failed to create new request");
        }

        switch (data.jenis_pengajuan) {
          case "1":
            // create new SuratDomisili
            const createSuratDomisili = await SuratDomisili.create(
              {
                id_pengajuan: newRequest.id,
                nomor_ktp: data.anggota_keluarga,
                jenis_ttd: data.jenis_ttd,
              },
              { transaction }
            );

            if (!createSuratDomisili) {
              throw new Error("Failed to create SuratDomisili");
            }
            break;

          case "2":
            // create new SuratKelahiran
            const createSuratKelahiran = await SuratKelahiran.create(
              {
                id_pengajuan: newRequest.id,
                nomor_ktp_pemohon: data.nomor_ktp,
                nomor_ktp_pasangan: data.anggota_keluarga,
                nama_anak: data.nama_anak,
                tempat_lahir: data.tempat_lahir,
                tanggal_lahir: data.tanggal_lahir,
                jam_lahir: data.jam_lahir,
                jenis_kelamin: data.jenis_kelamin,
                dokumen: data.surat_rs,
              },
              { transaction }
            );

            if (!createSuratKelahiran) {
              throw new Error("Failed to create SuratKelahiran");
            }
            break;

          case "3":
            // create new SuratKematian
            const createSuratKematian = await SuratKematian.create(
              {
                id_pengajuan: newRequest.id,
                nomor_ktp: data.anggota_keluarga, //anggota keluarga yg meninggal
                tanggal_kematian: data.tanggal_kematian,
                jam_kematian: data.jam_kematian,
                dokumen: data.surat_rs,
                tempat_kematian: data.tempat_kematian,
                tanggal_pemakaman: data.tanggal_pemakaman,
                tempat_pemakaman: data.tempat_pemakaman,
                jenis_ttd: data.jenis_ttd,
              },
              { transaction }
            );

            // console.log(createSuratKematian, "createSuratKematian");
            if (!createSuratKematian) {
              throw new Error("Failed to create SuratKematian");
            }
            break;

          default:
            break;
        }

        return newRequest;
      });

      return createPengajuan;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Update request status
  updateRequest: async (criteria, data) => {
    const transaction = await sequelize.transaction();
    try {
      // Validate the input criteria
      if (!criteria.name || !criteria.value) {
        throw new Error("Criteria name and value are required");
      }

      // Update request status
      const updateRequest = await Pengajuan.update(
        data,
        {
          where: {
            [criteria.name]: {
              [Op.eq]: criteria.value,
            },
          },
        },
        { transaction }
      );

      switch (data.jenis_pengajuan) {
        case 1:
          const updateSuratDomisili = await SuratDomisili.update(
            { surat: data.surat },
            {
              where: {
                id_pengajuan: {
                  [Op.eq]: criteria.value,
                },
              },
            },
            { transaction }
          );

          break;
        case 2:
          // surat kelahiran belum digunakan
          break;
        case 3:
          const updateSuratKematian = await SuratKematian.update(
            { surat: data.surat },
            {
              where: {
                id_pengajuan: {
                  [Op.eq]: criteria.value,
                },
              },
            },
            { transaction }
          );

          break;
        default:
          break;
      }

      // create notification for user
      const newNotification = {
        id_pengguna: data.id_pengguna,
        title: "Letter Request",
        message: `Your letter request has been ${
          Number(data.status_pengajuan) === 2 ? "processed" : Number(data.status_pengajuan) === 3 ? "completed" : "rejected"
        }`,
        // type: "request",
        status: "unread",
        url: "/request",
      };

      const notif = await Notification.create(newNotification, { transaction });
      // console.log(data.status_pengajuan, "status_pengajuan");
      // console.log(notif, "notif");

      await transaction.commit();
      return updateRequest;
    } catch (error) {
      console.error("Error updating request:", error);
      await transaction.rollback();
      throw error;
    }
  },
};
