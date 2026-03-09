const jwt = require("jsonwebtoken");
const config = require("../config/env");
const AppError = require("./appError");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Token de autenticação ausente"));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, config.auth.jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError(401, "Token inválido ou expirado"));
  }
}

module.exports = authenticateToken;
