const AppError = require("./appError");

function isValidIsoDate(value) {
  return !Number.isNaN(Date.parse(value));
}

function validateCreateOrder(req, res, next) {
  const { numeroPedido, valorTotal, dataCriacao, items } = req.body;
  const errors = [];

  if (typeof numeroPedido !== "string" || numeroPedido.trim().length === 0) {
    errors.push("numeroPedido deve ser uma string não vazia");
  }

  if (typeof valorTotal !== "number" || valorTotal < 0) {
    errors.push("valorTotal deve ser um número maior ou igual a zero");
  }

  if (!dataCriacao || !isValidIsoDate(dataCriacao)) {
    errors.push("dataCriacao deve estar em um formato de data válido");
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("items deve ser um array com pelo menos um item");
  } else {
    items.forEach((item, index) => {
      if (!Number.isInteger(item.idItem)) {
        errors.push(`items[${index}].idItem deve ser inteiro`);
      }

      if (!Number.isInteger(item.quantidadeItem) || item.quantidadeItem <= 0) {
        errors.push(`items[${index}].quantidadeItem deve ser inteiro maior que zero`);
      }

      if (typeof item.valorItem !== "number" || item.valorItem < 0) {
        errors.push(`items[${index}].valorItem deve ser número maior ou igual a zero`);
      }
    });
  }

  if (errors.length > 0) {
    return next(new AppError(400, "Payload inválido", errors));
  }

  return next();
}

function validateUpdateOrder(req, res, next) {
  const { valorTotal } = req.body;

  if (typeof valorTotal !== "number" || valorTotal < 0) {
    return next(
      new AppError(400, "Payload inválido", ["valorTotal deve ser um número maior ou igual a zero"])
    );
  }

  return next();
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return next(new AppError(400, "Payload inválido", ["username e password são obrigatórios"]));
  }

  return next();
}

module.exports = {
  validateCreateOrder,
  validateLogin,
  validateUpdateOrder
};
