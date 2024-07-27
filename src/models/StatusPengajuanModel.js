const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StatusPengajuan extends Model {
    static associate(models) {
      // define association here
      StatusPengajuan.hasMany(models.Pengajuan, {
        foreignKey: "status_pengajuan",
        as: "pengajuan",
      });
    }
  }
  StatusPengajuan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StatusPengajuan",
      tableName: "status_pengajuan",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return StatusPengajuan;
};
