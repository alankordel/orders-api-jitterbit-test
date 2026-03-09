const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { validateLogin } = require("../middleware/validators");
const authController = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Gera token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", validateLogin, asyncHandler(authController.login));

module.exports = router;
