const express = require("express");
const route = require("./routes");
const app = express();
const port = 8000;
app.use(express.json());
app.use(route);
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
