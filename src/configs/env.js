module.exports = {
  port: 3003,
  appEndpoint: "http://localhost:3000",
  apiEndpoint: "http://localhost:3000",
  environment: "production",
  db_name: process.env.PGDATABASE,
  db_username: process.env.PGUSER,
  db_password: process.env.PGPASSWORD,
  db_host: process.env.PGHOST,
  db_port: process.env.PGPORT,
  db_dialect: "postgres",
};
