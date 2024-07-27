const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmergencyViewLog extends Model {
    static associate(models) {
      // define association here
      EmergencyViewLog.belongsTo(models.Emergency, {
        foreignKey: "emergency_id",
        as: "emergency",
      });
      EmergencyViewLog.belongsTo(models.Pengguna, {
        foreignKey: "agent_id",
        as: "agent",
      });
    }
  }
  EmergencyViewLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emergency_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      agent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EmergencyViewLog",
      tableName: "emergency_alert_view_log",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return EmergencyViewLog;
};
