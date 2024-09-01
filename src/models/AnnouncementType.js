const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnnouncementType extends Model {
    static associate(models) {
      // define association here
      AnnouncementType.hasMany(models.Announcement, {
        foreignKey: "type",
        as: "announcements",
      });
    }
  }
  AnnouncementType.init(
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
      modelName: "AnnouncementType",
      tableName: "announcement_type",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return AnnouncementType;
};
