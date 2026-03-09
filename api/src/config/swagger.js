const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Orders API",
      version: "2.0.0",
      description: "API para gerenciamento de pedidos com autenticação JWT"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        CreateOrderPayload: {
          type: "object",
          required: ["numeroPedido", "valorTotal", "dataCriacao", "items"],
          properties: {
            numeroPedido: {
              type: "string"
            },
            valorTotal: {
              type: "number"
            },
            dataCriacao: {
              type: "string",
              format: "date-time"
            },
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["idItem", "quantidadeItem", "valorItem"],
                properties: {
                  idItem: {
                    type: "integer"
                  },
                  quantidadeItem: {
                    type: "integer"
                  },
                  valorItem: {
                    type: "number"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);
