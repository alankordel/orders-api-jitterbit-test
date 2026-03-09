const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const express = require("express");
const pool = require("./db/connection");

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* FUNÇÃO DE MAPPING ITEM (BANCO -> API) */
function mapItem(item) {
  return {
    idItem: item.productid,
    quantidadeItem: item.quantity,
    valorItem: item.price
  };
}

/* FUNÇÃO DE MAPPING ORDER (BANCO -> API) */
function mapOrder(order, items) {
  return {
    numeroPedido: order.orderid,
    valorTotal: order.value,
    dataCriacao: order.creationdate,
    items: items.map(mapItem)
  };
}

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
app.get("/orders", async (req, res) => {
  try {

    const ordersResult = await pool.query("SELECT * FROM Orders");

    const orders = [];

    for (const order of ordersResult.rows) {

      const itemsResult = await pool.query(
        "SELECT * FROM Items WHERE orderId = $1",
        [order.orderid]
      );

      orders.push(
        mapOrder(order, itemsResult.rows)
      );

    }

    res.json(orders);

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Buscar pedido pelo número
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Número do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
app.get("/orders/:id", async (req, res) => {
  try {

    const id = req.params.id;

    const orderResult = await pool.query(
      "SELECT * FROM Orders WHERE orderId = $1",
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const itemsResult = await pool.query(
      "SELECT * FROM Items WHERE orderId = $1",
      [id]
    );

    res.json(
      mapOrder(orderResult.rows[0], itemsResult.rows)
    );

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroPedido:
 *                 type: string
 *               valorTotal:
 *                 type: number
 *               dataCriacao:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                     quantidadeItem:
 *                       type: number
 *                     valorItem:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
app.post("/orders", async (req, res) => {

  const client = await pool.connect();

  try {

    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    await client.query("BEGIN");

    await client.query(
      "INSERT INTO Orders (orderId, value, creationDate) VALUES ($1,$2,$3)",
      [numeroPedido, valorTotal, dataCriacao]
    );

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

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualizar valor do pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Número do pedido
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pedido atualizado
 */
app.put("/orders/:id", async (req, res) => {

  try {

    const id = req.params.id;
    const { valorTotal } = req.body;

    const result = await pool.query(
      "UPDATE Orders SET value = $1 WHERE orderId = $2 RETURNING *",
      [valorTotal, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.json({
      numeroPedido: result.rows[0].orderid,
      valorTotal: result.rows[0].value,
      dataCriacao: result.rows[0].creationdate
    });

  } catch (error) {

    console.error(error);
    res.status(500).send("Database error");

  }

});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Deletar pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Número do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido deletado
 */
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