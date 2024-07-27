const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Emergency extends Model {
    static associate(models) {
      // define association here
      Emergency.belongsTo(models.Pengguna, {
        foreignKey: "id_pengguna",
        as: "pengguna",
      });
      Emergency.belongsTo(models.Pengguna, {
        foreignKey: "agent_id",
        as: "agent",
      });
      Emergency.hasMany(models.EmergencyViewLog, {
        foreignKey: "emergency_id",
        as: "view_log",
      });
    }
  }
  Emergency.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_pengguna: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lat: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lng: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deskripsi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      foto: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_kejadian: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agent_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Emergency",
      tableName: "emergency_alert",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Emergency;
};
