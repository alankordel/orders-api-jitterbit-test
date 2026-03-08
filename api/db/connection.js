const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "orders_db",
  password: "#tlou",
  port: 5432
});

module.exports = pool;