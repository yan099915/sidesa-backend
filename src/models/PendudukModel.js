const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penduduk extends Model {
    static associate(models) {
      // define association here
      Penduduk.belongsTo(models.Keluarga, {
        foreignKey: "nomor_kk",
        targetKey: "nomor_kk",
        as: "keluarga",
      });

      Penduduk.belongsTo(models.Pengguna, {
        foreignKey: "nomor_ktp",
        targetKey: "nomor_ktp",
        as: "pengguna",
      });

      Penduduk.hasMany(models.SuratDomisili, {
        foreignKey: "nomor_ktp",
        targetKey: "nomor_ktp",
        as: "surat_domisili",
      });

      Penduduk.hasMany(models.SuratKematian, {
        foreignKey: "nomor_ktp",
        targetKey: "nomor_ktp",
        as: "surat_kematian",
      });
    }
  }
  Penduduk.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      foto_diri: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      foto_ktp: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      foto_kk: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      nomor_ktp: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nomor_kk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rw: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dusun: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pekerjaan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pendidikan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hubungan_keluarga: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status_perkawinan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      golongan_darah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.DECIMAL(10, 8),
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8),
      },
    },
    {
      sequelize,
      modelName: "Penduduk",
      tableName: "penduduk",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Penduduk;
};
