const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VerificationStatus extends Model {
    static associate(models) {
      // define association here
      VerificationStatus.hasMany(models.Verification, {
        foreignKey: "status",
        as: "verifications",
      });
    }
  }
  VerificationStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VerificationStatus",
      tableName: "verification_status",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return VerificationStatus;
};
