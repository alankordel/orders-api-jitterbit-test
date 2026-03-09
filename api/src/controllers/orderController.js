const AppError = require("../middleware/appError");
const orderService = require("../services/orderService");

async function listOrders(req, res) {
  const orders = await orderService.listOrders();
  return res.status(200).json(orders);
}

async function getOrderById(req, res, next) {
  const order = await orderService.findOrderById(req.params.id);

  if (!order) {
    return next(new AppError(404, "Pedido não encontrado"));
  }

  return res.status(200).json(order);
}

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    if (error.code === "23505") {
      return next(new AppError(409, "Pedido ou item já existe"));
    }

    return next(error);
  }
}

async function updateOrder(req, res, next) {
  const updatedOrder = await orderService.updateOrderValue(req.params.id, req.body.valorTotal);

  if (!updatedOrder) {
    return next(new AppError(404, "Pedido não encontrado"));
  }

  return res.status(200).json(updatedOrder);
}

async function deleteOrder(req, res, next) {
  const deleted = await orderService.deleteOrder(req.params.id);

  if (!deleted) {
    return next(new AppError(404, "Pedido não encontrado"));
  }

  return res.status(200).json({ message: "Pedido deletado com sucesso" });
}

module.exports = {
  createOrder,
  deleteOrder,
  getOrderById,
  listOrders,
  updateOrder
};
