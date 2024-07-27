const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SuratKematian extends Model {
    static associate(models) {
      // define association here
      SuratKematian.hasOne(models.Pengajuan, {
        foreignKey: "id_pengajuan",
        as: "surat_kematian",
      });

      SuratKematian.belongsTo(models.JenisTTD, {
        foreignKey: "jenis_ttd",
        as: "jenis_tanda_tangan",
      });

      SuratKematian.belongsTo(models.Penduduk, {
        foreignKey: "nomor_ktp",
        targetKey: "nomor_ktp",
        as: "penduduk",
      });
    }
  }

  SuratKematian.init(
    {
      id_pengajuan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      nomor_ktp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_kematian: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      jam_kematian: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      dokumen: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      surat: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      tempat_kematian: {
        type: DataTypes.STRING,
      },
      tanggal_pemakaman: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      tempat_pemakaman: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_ttd: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SuratKematian",
      tableName: "surat_kematian",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return SuratKematian;
};
