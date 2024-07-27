"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pengguna extends Model {
    static associate(models) {
      // Example of association:
      Pengguna.hasMany(models.Pengajuan, {
        foreignKey: "id_pengguna",
        as: "pengajuan",
      });

      Pengguna.hasOne(models.Penduduk, {
        foreignKey: "nomor_ktp",
        sourceKey: "nomor_ktp",
        as: "penduduk",
      });

      Pengguna.hasMany(models.Notification, {
        foreignKey: "id_pengguna",
        as: "notification",
      });

      Pengguna.hasMany(models.Emergency, {
        foreignKey: "id_pengguna",
        as: "emergency",
      });

      Pengguna.hasMany(models.EmergencyViewLog, {
        foreignKey: "agent_id",
        as: "view_log",
      });
    }
  }
  Pengguna.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.INTEGER,
      },
      nomor_ktp: {
        type: DataTypes.STRING,
      },
      aktif: {
        type: DataTypes.BOOLEAN,
      },
      verified: {
        type: DataTypes.BOOLEAN,
      },
      session: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Pengguna",
      tableName: "pengguna", // Nama tabel di database
      timestamps: true, // Menonaktifkan pembuatan kolom createdAt dan updatedAt
      underscored: true, // Mengubah format camelCase menjadi snake_case
    }
  );
  return Pengguna;
};
