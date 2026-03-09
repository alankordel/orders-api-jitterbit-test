const AppError = require("./appError");

function notFoundHandler(req, res, next) {
  next(new AppError(404, "Rota não encontrada"));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  const response = {
    message: isClientError ? err.message : "Erro interno do servidor"
  };

  if (err.details && isClientError) {
    response.details = err.details;
  }

  if (!isClientError) {
    console.error(err);
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  errorHandler,
  notFoundHandler
};
