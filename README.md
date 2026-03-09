# Orders API - Jitterbit Test

API REST para gerenciamento de pedidos, integrada com PostgreSQL, documentação Swagger e autenticação JWT.

## Stack
- Node.js
- Express
- PostgreSQL
- Swagger (swagger-jsdoc + swagger-ui-express)
- JWT (jsonwebtoken)

## Estrutura do projeto
- `api/`: aplicação Node.js
- `database/schema.sql`: schema e dados iniciais
- `docs/arquitetura.md`: visão de arquitetura
- `integration/jitterbit-flow.md`: proposta de fluxo de integração

## Pré-requisitos
- Node.js 18+
- PostgreSQL 14+

## Configuração
1. Crie o banco `orders_db` no PostgreSQL.
2. Execute o script `database/schema.sql`.
3. Copie `api/.env.example` para `api/.env` e ajuste os valores.
4. Instale dependências em `api/`:
   - `npm install`
5. Inicie a API:
   - `npm start`

## Variáveis de ambiente (`api/.env`)
- `PORT=3000`
- `DB_USER=postgres`
- `DB_HOST=localhost`
- `DB_NAME=orders_db`
- `DB_PASSWORD=postgres`
- `DB_PORT=5432`
- `JWT_SECRET=change-me-in-production`
- `JWT_EXPIRES_IN=1h`
- `ADMIN_USER=admin`
- `ADMIN_PASSWORD=admin123`

## Endpoints principais
- `POST /auth/login` -> gera JWT
- `GET /orders` -> lista pedidos
- `GET /orders/:id` -> busca pedido
- `POST /orders` -> cria pedido (token obrigatório)
- `PUT /orders/:id` -> atualiza valor do pedido (token obrigatório)
- `DELETE /orders/:id` -> remove pedido (token obrigatório)

## Respostas HTTP adotadas
- `200 OK`: leitura, atualização e remoção com sucesso
- `201 Created`: criação com sucesso
- `400 Bad Request`: payload inválido
- `401 Unauthorized`: token ausente/inválido ou credencial inválida
- `404 Not Found`: pedido/rota não encontrada
- `409 Conflict`: violação de chave única
- `500 Internal Server Error`: erro não previsto

## Swagger
- URL: `http://localhost:3000/api-docs`

## Exemplo rápido de autenticação
1. Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
2. Use o token no header `Authorization: Bearer <token>` para `POST`, `PUT` e `DELETE` em `/orders`.
