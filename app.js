import express from "express";
import drivers from "./data.js";

const baseAPIRoute = "/api/v1";

const app = express();

app.get(baseAPIRoute + "/drivers", (request, response) => {
  response.status(200).send(drivers);
});

const port = 3000;

app.listen(port, () =>
  console.log(
    `API running successfully!\n\nAccess it on: \x1b[36mhttp://localhost:${port}`,
  ),
);
