const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define("Questions", {
    ID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    Question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Required: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    QuestionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Choices: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    TableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Column: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DataType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Questions;
};
