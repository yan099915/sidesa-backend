const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Articles extends Model {
    static associate(models) {
      // define association here
      //   Emergency.belongsTo(models.Pengguna, {
      //     foreignKey: "id_pengguna",
      //     as: "pengguna",
      //   });
      Articles.belongsTo(models.ArticleStatus, {
        foreignKey: "status",
        as: "article_status",
      });

      Articles.belongsTo(models.ArticleThumbnail, {
        foreignKey: "thumbnail",
        as: "article_thumbnail",
      });
    }
  }
  Articles.init(
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
      featured: {
        type: DataTypes.BOOLEAN,
        // allowNull: false,
      },
      thumbnail: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Articles",
      tableName: "articles",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Articles;
};
