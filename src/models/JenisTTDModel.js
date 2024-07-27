const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisTTD extends Model {
    static associate(models) {
      // define association here
      JenisTTD.hasMany(models.SuratDomisili, {
        foreignKey: "jenis_ttd",
        as: "surat_domisili",
      });

      JenisTTD.hasMany(models.SuratKematian, {
        foreignKey: "jenis_ttd",
        as: "surat_kematian",
      });

      JenisTTD.hasMany(models.SuratKelahiran, {
        foreignKey: "jenis_ttd",
        as: "surat_kelahiran",
      });
    }
  }
  JenisTTD.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JenisTTD",
      tableName: "jenis_ttd",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return JenisTTD;
};
