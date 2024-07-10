const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define("Reports", {
    DocumentID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Component: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    County: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Keywords: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    File: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    End: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Recommendation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Reports;
};
