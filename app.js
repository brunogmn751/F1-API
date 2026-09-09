import express from "express";
import { drivers } from "./data.js";
import { url } from "node:inspector";

const baseAPIRoute = "/api/v1";

const app = express();

app.get(baseAPIRoute + "/drivers", (request, response) => {
  response.status(200).send(drivers);
});

app.get(baseAPIRoute+'/drivers/standings/:position', (request, response)=>{
    const position = Number(request.params.position);
    response.status(200).send(drivers[position - 1])
}) 

app.get(baseAPIRoute+'/drivers/:id' ,(request, response)=>{
    const {id} = request.params;
    const selectedDriver = drivers.find(driver => driver.id === id);
    response.status(200).send(selectedDriver);
})

const port = 3000;

app.listen(port, () =>
  console.log(
    `API running successfully!\n\nAccess it on: \x1b[36mhttp://localhost:${port}`,
  ),
);
