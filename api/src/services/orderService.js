const pool = require("../db/pool");

function mapItem(row) {
  return {
    idItem: row.productid,
    quantidadeItem: row.quantity,
    valorItem: Number(row.price)
  };
}

function mapGroupedOrders(rows) {
  const grouped = new Map();

  for (const row of rows) {
    if (!grouped.has(row.orderid)) {
      grouped.set(row.orderid, {
        numeroPedido: row.orderid,
        valorTotal: Number(row.value),
        dataCriacao: row.creationdate,
        items: []
      });
    }

    if (row.productid !== null) {
      grouped.get(row.orderid).items.push(mapItem(row));
    }
  }

  return Array.from(grouped.values());
}

async function listOrders() {
  const query = `
    SELECT
      o.orderid,
      o.value,
      o.creationdate,
      i.productid,
      i.quantity,
      i.price
    FROM Orders o
    LEFT JOIN Items i ON i.orderId = o.orderId
    ORDER BY o.orderid, i.productid
  `;

  const result = await pool.query(query);
  return mapGroupedOrders(result.rows);
}

async function findOrderById(orderId) {
  const query = `
    SELECT
      o.orderid,
      o.value,
      o.creationdate,
      i.productid,
      i.quantity,
      i.price
    FROM Orders o
    LEFT JOIN Items i ON i.orderId = o.orderId
    WHERE o.orderId = $1
    ORDER BY i.productid
  `;

  const result = await pool.query(query, [orderId]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapGroupedOrders(result.rows)[0];
}

async function createOrder(orderPayload) {
  const { numeroPedido, valorTotal, dataCriacao, items } = orderPayload;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "INSERT INTO Orders (orderId, value, creationDate) VALUES ($1, $2, $3)",
      [numeroPedido, valorTotal, dataCriacao]
    );

    for (const item of items) {
      await client.query(
        "INSERT INTO Items (orderId, productId, quantity, price) VALUES ($1, $2, $3, $4)",
        [numeroPedido, item.idItem, item.quantidadeItem, item.valorItem]
      );
    }

    await client.query("COMMIT");

    return findOrderById(numeroPedido);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateOrderValue(orderId, valorTotal) {
  const result = await pool.query(
    "UPDATE Orders SET value = $1 WHERE orderId = $2 RETURNING orderId",
    [valorTotal, orderId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return findOrderById(orderId);
}

async function deleteOrder(orderId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM Items WHERE orderId = $1", [orderId]);
    const deletedOrder = await client.query(
      "DELETE FROM Orders WHERE orderId = $1 RETURNING orderId",
      [orderId]
    );
    await client.query("COMMIT");

    return deletedOrder.rowCount > 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createOrder,
  deleteOrder,
  findOrderById,
  listOrders,
  updateOrderValue
};
