const express = require("express");
const pool = require("./db/connection");

const app = express();

app.use(express.json());

/* LISTAR TODOS PEDIDOS */
app.get("/orders", async (req, res) => {
  try {

    const result = await pool.query("SELECT * FROM Orders");

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }
});

/* BUSCAR PEDIDO POR ID */
app.get("/orders/:id", async (req, res) => {
  try {

    const id = req.params.id;

    const order = await pool.query(
      "SELECT * FROM Orders WHERE orderId = $1",
      [id]
    );

    const items = await pool.query(
      "SELECT * FROM Items WHERE orderId = $1",
      [id]
    );

    res.json({
      order: order.rows[0],
      items: items.rows
    });

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }
});

/* CRIAR PEDIDO (COM MAPPING DO JSON DO TESTE) */
app.post("/orders", async (req, res) => {

  const client = await pool.connect();

  try {

    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    await client.query("BEGIN");

    /* salvar pedido */
    await client.query(
      "INSERT INTO Orders (orderId, value, creationDate) VALUES ($1,$2,$3)",
      [numeroPedido, valorTotal, dataCriacao]
    );

    /* salvar itens */
    for (const item of items) {

      await client.query(
        "INSERT INTO Items (orderId, productId, quantity, price) VALUES ($1,$2,$3,$4)",
        [
          numeroPedido,
          item.idItem,
          item.quantidadeItem,
          item.valorItem
        ]
      );

    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Pedido criado com sucesso"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);
    res.status(500).send("Database error");

  } finally {

    client.release();

  }

});

/* ATUALIZAR PEDIDO */
app.put("/orders/:id", async (req, res) => {

  try {

    const id = req.params.id;
    const { valorTotal } = req.body;

    const result = await pool.query(
      "UPDATE Orders SET value = $1 WHERE orderId = $2 RETURNING *",
      [valorTotal, id]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }

});

/* DELETAR PEDIDO */
app.delete("/orders/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await pool.query("DELETE FROM Items WHERE orderId = $1", [id]);
    await pool.query("DELETE FROM Orders WHERE orderId = $1", [id]);

    res.json({ message: "Pedido deletado com sucesso" });

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }

});

app.listen(3000, () => {
  console.log("Server rodando na porta 3000");
});