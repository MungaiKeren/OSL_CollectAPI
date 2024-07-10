const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const FAQs = sequelize.define("FAQs", {
        ID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        Question: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        Answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });
    return FAQs;
}