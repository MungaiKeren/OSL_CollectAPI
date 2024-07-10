const env = require("./env");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(env.db_name, env.db_username, env.db_password, {
  host: env.db_host,
  dialect: env.db_dialect,
  port: env.db_port,
  dialectOptions: {
    connectTimeout: 600000000,
  },
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 12000,
    idle: 30000,
  },
});
module.exports = sequelize;
