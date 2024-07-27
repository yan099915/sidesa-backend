const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    static associate(models) {
      // define association here
      Verification.belongsTo(models.Pengguna, {
        foreignKey: "id_pengguna",
        as: "pengguna",
      });

      Verification.belongsTo(models.Pengguna, {
        foreignKey: "agent_id",
        as: "agent",
      });

      Verification.belongsTo(models.VerificationStatus, {
        foreignKey: "status",
        as: "verification_status",
      });
    }
  }
  Verification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      foto_diri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      foto_ktp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      foto_kk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomor_ktp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomor_kk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lng: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      lat: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      agama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rw: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pekerjaan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pendidikan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status_perkawinan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hubungan_keluarga: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      golongan_darah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_pengguna: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      agent_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Verification",
      tableName: "verification",
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Verification;
};
