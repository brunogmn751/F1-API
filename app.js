import express from "express";
import helmet from "helmet";
import driversRouter from "./routes/drivers.js";
import teamsRouter from "./routes/teams.js";

const baseAPIRoute = '/api/v1';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(baseAPIRoute + '/drivers', driversRouter);
app.use(baseAPIRoute + '/teams', teamsRouter);
app.use((error, request, response, next)=>{
  response.status(error.statusCode ?? 500).send(error)
});



//Middleware that transforms json from requests int JS objects


const port = 3000;

app.listen(port, () =>
  console.log(
    `API running successfully!\n\nAccess it on: \x1b[36mhttp://localhost:${port}`,
  ),
);
