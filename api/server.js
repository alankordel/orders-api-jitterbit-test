const express = require("express");
const pool = require("./db/connection");

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  try {

    const result = await pool.query('SELECT * FROM Orders');

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }
});

app.listen(3000, () => {
  console.log("Server rodando na porta 3000");
});