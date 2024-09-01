const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    static associate(models) {
      // define association here
      //   Emergency.belongsTo(models.Pengguna, {
      //     foreignKey: "id_pengguna",
      //     as: "pengguna",
      //   });
      //   Emergency.belongsTo(models.Pengguna, {
      //     foreignKey: "agent_id",
      //     as: "agent",
      //   });
      //   Emergency.hasMany(models.EmergencyViewLog, {
      //     foreignKey: "emergency_id",
      //     as: "view_log",
      //   });
    }
  }
  Images.init(
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
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Images",
      tableName: "images",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Images;
};
