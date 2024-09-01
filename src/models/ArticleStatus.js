const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArticleStatus extends Model {
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
      ArticleStatus.hasMany(models.Articles, {
        foreignKey: "status",
        as: "articles",
      });
    }
  }
  ArticleStatus.init(
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
      modelName: "ArticleStatus",
      tableName: "article_status",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return ArticleStatus;
};
