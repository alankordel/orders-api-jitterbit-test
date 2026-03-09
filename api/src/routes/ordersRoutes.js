const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const authenticateToken = require("../middleware/authenticateToken");
const { validateCreateOrder, validateUpdateOrder } = require("../middleware/validators");
const orderController = require("../controllers/orderController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Operações de pedidos
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get("/", asyncHandler(orderController.listOrders));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido pelo número
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:id", asyncHandler(orderController.getOrderById));

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderPayload'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Payload inválido
 *       409:
 *         description: Pedido ou item já existe
 */
router.post("/", authenticateToken, validateCreateOrder, asyncHandler(orderController.createOrder));

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza o valor total de um pedido
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [valorTotal]
 *             properties:
 *               valorTotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       400:
 *         description: Payload inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.put("/:id", authenticateToken, validateUpdateOrder, asyncHandler(orderController.updateOrder));

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Deleta um pedido
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido deletado
 *       404:
 *         description: Pedido não encontrado
 */
router.delete("/:id", authenticateToken, asyncHandler(orderController.deleteOrder));

module.exports = router;
