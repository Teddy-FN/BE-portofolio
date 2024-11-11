"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
module.exports = sequelize.define(
  "education",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    greetings: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      primaryKey: true,
      type: DataTypes.BOOLEAN,
    },
    createdBy: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    modifiedBy: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "education",
  }
);
