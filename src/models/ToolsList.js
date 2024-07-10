const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ToolsList = sequelize.define("ToolsList", {
    ID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    ToolName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    County: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    DataTableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return ToolsList;
};
