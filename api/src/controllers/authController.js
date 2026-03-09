const jwt = require("jsonwebtoken");
const config = require("../config/env");
const AppError = require("../middleware/appError");

function login(req, res, next) {
  const { username, password } = req.body;

  if (username !== config.auth.adminUser || password !== config.auth.adminPassword) {
    return next(new AppError(401, "Credenciais inválidas"));
  }

  const token = jwt.sign({ username }, config.auth.jwtSecret, {
    expiresIn: config.auth.tokenExpiresIn
  });

  return res.status(200).json({
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: config.auth.tokenExpiresIn
  });
}

module.exports = {
  login
};
