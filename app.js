require("dotenv").config();
const app = require("./src/server");

const { PORT, NODE_ENV } = process.env;

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000} and use ${NODE_ENV} ENV`);
});
