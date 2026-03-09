# Fluxo de integração Jitterbit (proposta)

## Objetivo
Sincronizar pedidos entre um sistema de origem (ERP/CRM) e a Orders API.

## Fluxo sugerido
1. **Extract**: Jitterbit lê pedidos novos/alterados no sistema de origem.
2. **Transform**: normaliza o payload para o contrato da API (`numeroPedido`, `valorTotal`, `dataCriacao`, `items`).
3. **Authenticate**: chama `POST /auth/login` e guarda token JWT temporário.
4. **Load**:
   - `POST /orders` para pedidos novos.
   - `PUT /orders/:id` para atualizar valor de pedido existente.
5. **Error handling**:
   - `400`: enviar para fila de dados inválidos.
   - `401`: renovar token e reprocessar.
   - `409`: tratar como duplicidade e seguir regra de negócio.
   - `500`: retentativa com backoff exponencial.
6. **Audit**: registrar sucesso/falha por `numeroPedido`.

## Regras de idempotência recomendadas
- Sempre enviar `numeroPedido` como identificador único de integração.
- Em caso de `409`, consultar `GET /orders/:id` para decidir merge/retry.

## Campos mínimos obrigatórios para envio
- `numeroPedido` (string)
- `valorTotal` (number)
- `dataCriacao` (ISO 8601)
- `items` (array com `idItem`, `quantidadeItem`, `valorItem`)
