const app = require("./src/app");
const config = require("./src/config/env");

app.listen(config.port, () => {
  console.log(`Server rodando na porta ${config.port}`);
});
