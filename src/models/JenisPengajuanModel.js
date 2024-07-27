const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisPengajuan extends Model {
    static associate(models) {
      // define association here
      JenisPengajuan.hasMany(models.Pengajuan, {
        foreignKey: "jenis_pengajuan",
        as: "pengajuan",
      });
    }
  }
  JenisPengajuan.init(
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
      modelName: "JenisPengajuan",
      tableName: "jenis_pengajuan",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return JenisPengajuan;
};
