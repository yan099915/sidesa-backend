const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SuratDomisili extends Model {
    static associate(models) {
      // define association here
      SuratDomisili.hasOne(models.Pengajuan, {
        foreignKey: "id_pengajuan",
        as: "surat_domisili",
      });

      SuratDomisili.belongsTo(models.JenisTTD, {
        foreignKey: "jenis_ttd",
        // targetKey: "jenis_ttd",
        as: "jenis_tanda_tangan",
      });

      SuratDomisili.belongsTo(models.Penduduk, {
        foreignKey: "nomor_ktp",
        targetKey: "nomor_ktp",
        as: "penduduk",
      });
    }
  }

  SuratDomisili.init(
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
      dokumen: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      surat: {
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
      modelName: "SuratDomisili",
      tableName: "surat_domisili",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return SuratDomisili;
};
