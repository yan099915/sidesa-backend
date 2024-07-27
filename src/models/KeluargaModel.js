const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Keluarga extends Model {
    static associate(models) {
      // define association here
      Keluarga.hasMany(models.Penduduk, {
        foreignKey: "nomor_kk",
        sourceKey: "nomor_kk",
        as: "anggota_keluarga",
      });
    }
  }
  Keluarga.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nomor_kk: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      kepala_keluarga: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      rt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rw: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Keluarga",
      tableName: "keluarga",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Keluarga;
};
