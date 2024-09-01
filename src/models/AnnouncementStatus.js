const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnnouncementStatus extends Model {
    static associate(models) {
      // define association here
      //   Emergency.belongsTo(models.Pengguna, {
      //     foreignKey: "id_pengguna",
      //     as: "pengguna",
      //   });
      AnnouncementStatus.hasMany(models.Announcement, {
        foreignKey: "status",
        as: "announcements",
      });
    }
  }
  AnnouncementStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AnnouncementStatus",
      tableName: "announcement_status",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return AnnouncementStatus;
};
