# Arquitetura da API de Pedidos

## Visão geral
A API segue uma arquitetura em camadas para separar responsabilidades e facilitar manutenção:

- `routes`: define endpoints e aplica middlewares
- `controllers`: recebe request/response e orquestra o fluxo
- `services`: contém regras de acesso a dados e transações
- `db`: gerencia conexão com PostgreSQL
- `middleware`: validação, autenticação e tratamento de erros
- `config`: centraliza variáveis de ambiente e Swagger

## Fluxo de requisição
1. Requisição chega na rota (`src/routes/*`).
2. Middlewares são executados (auth/validação).
3. Controller chama o service.
4. Service executa queries SQL e retorna dados normalizados.
5. Controller responde com o status HTTP apropriado.
6. Em falha, middleware global de erro padroniza a resposta.

## Decisões técnicas
- Payload de API em português (`numeroPedido`, `valorTotal`, `dataCriacao`) por aderência ao domínio.
- Nomes internos em inglês para manter consistência técnica (`orderService`, `orderController`).
- Uso de transação (`BEGIN/COMMIT/ROLLBACK`) para criação e remoção de pedido com itens.
- JWT aplicado em operações de escrita para reduzir risco de alteração indevida.

## Melhorias futuras sugeridas
- Cobertura de testes automatizados (unit + integração).
- Rate limiting e CORS configurável.
- Observabilidade (logs estruturados e tracing).
- Versionamento de API (`/v1`).
