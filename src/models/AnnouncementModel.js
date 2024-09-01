const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    static associate(models) {
      // define association here
      //   Emergency.belongsTo(models.Pengguna, {
      //     foreignKey: "id_pengguna",
      //     as: "pengguna",
      //   });
      Announcement.belongsTo(models.AnnouncementStatus, {
        foreignKey: "status",
        as: "announcement_status",
      });
      Announcement.belongsTo(models.AnnouncementType, {
        foreignKey: "type",
        as: "announcement_type",
      });
    }
  }
  Announcement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Announcement",
      tableName: "announcement",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Announcement;
};
