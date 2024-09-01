const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArticleThumbnail extends Model {
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
      ArticleThumbnail.hasMany(models.Articles, {
        foreignKey: "thumbnail",
        as: "articles",
      });
    }
  }
  ArticleThumbnail.init(
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
      modelName: "ArticleThumbnail",
      tableName: "article_thumbnails",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return ArticleThumbnail;
};
