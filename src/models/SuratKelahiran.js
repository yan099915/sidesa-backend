const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SuratKelahiran extends Model {
    static associate(models) {
      // define association here
      SuratKelahiran.hasOne(models.Pengajuan, {
        foreignKey: "id_pengajuan",
        as: "surat_kelahiran",
      });
      SuratKelahiran.belongsTo(models.JenisTTD, {
        foreignKey: "id",
        as: "jenis_tanda_tangan",
      });
    }
  }

  SuratKelahiran.init(
    {
      id_pengajuan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      nomor_ktp_pemohon: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomor_ktp_pasangan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama_anak: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      jam_lahir: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      dokumen: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      jenis_ttd: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SuratKelahiran",
      tableName: "surat_kelahiran",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return SuratKelahiran;
};
