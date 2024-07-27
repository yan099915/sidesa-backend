const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pengajuan extends Model {
    static associate(models) {
      // define association here
      Pengajuan.belongsTo(models.Pengguna, {
        foreignKey: "id_pengguna",
        as: "pengguna",
      });

      Pengajuan.belongsTo(models.StatusPengajuan, {
        foreignKey: "status_pengajuan",
        as: "status",
      });

      Pengajuan.belongsTo(models.JenisPengajuan, {
        foreignKey: "jenis_pengajuan",
        as: "type",
      });

      Pengajuan.hasOne(models.SuratDomisili, {
        foreignKey: "id_pengajuan",
        as: "surat_domisili",
      });

      Pengajuan.hasOne(models.SuratKelahiran, {
        foreignKey: "id_pengajuan",
        as: "surat_kelahiran",
      });

      Pengajuan.hasOne(models.SuratKematian, {
        foreignKey: "id_pengajuan",
        as: "surat_kematian",
      });
    }
  }

  Pengajuan.init(
    {
      id_pengguna: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jenis_pengajuan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status_pengajuan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agent_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      jenis_ttd: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Pengajuan",
      tableName: "pengajuan",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Pengajuan;
};
