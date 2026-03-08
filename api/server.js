const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Orders API rodando");
});

app.listen(3000, () => {
  console.log("Server rodando na porta 3000");
});