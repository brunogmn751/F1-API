import express from "express";
import { drivers, teams } from "./data.js";
import { randomUUID } from "node:crypto";
import Joi from "joi";

const baseAPIRoute = "/api/v1";

function checkValidDriver(driver) {
  if (!driver) {
    response
      .status(404)
      .send("The ID provided does'nt correspond to a driver on the database");
    return;
  }
}

const driverSchema = Joi.object({
  name: Joi.string().min(3).required(),
  team: Joi.string().min(3).required(),
  points: Joi.number().min(0).max(1000).default(0),
});

const app = express();

//Middleware that transforms json from requests int JS objects
app.use(express.json());

//Gets the full list of drivers
app.get(baseAPIRoute + "/drivers", (request, response) => {
  response.status(200).send(drivers);
});

//Gets the full list of teams
app.get(baseAPIRoute+'/teams', (request, response)=>{
    response.status(200).send(teams);
})

//A GET request to /drivers/standings/2 would return the driver in second place
app.get(baseAPIRoute + "/drivers/standings/:position", (request, response) => {
  const positionSchema = Joi.number.min(1).max(drivers.length);
  const position = Number(request.params.position);
  const error = positionSchema.validate(position, { abortEarly: false });
  if (error) {
    response.status(400).send(error);
    return;
  }
  response.status(200).send(drivers[position - 1]);
});

//A GET request to /teams/standings/2 would return the team in second place
app.get(baseAPIRoute + "/drivers/standings/:position", (request, response) => {
  const positionSchema = Joi.number.min(1).max(teams.length);
  const position = Number(request.params.position);
  const error = positionSchema.validate(position, { abortEarly: false });
  if (error) {
    response.status(400).send(error);
    return;
  }
  response.status(200).send(teams[position - 1]);
});


//Gets the driver by his ID
app.get(baseAPIRoute + "/drivers/:id", (request, response) => {
  const { id } = request.params;
  const selectedDriver = drivers.find((driver) => driver.id === id);
  checkValidDriver(selectedDriver);
  response.status(200).send(selectedDriver);
});

// Adds a new driver to the database based on a JSON with name, points and team provided by the request
app.post(baseAPIRoute + "/drivers", (request, response) => {
  const { error } = driverSchema.validate(request.body, { abortEarly: false });
  if (error) {
    response
      .status(400)
      .send(
        "It is required to provide a Name and a Team to register a new driver" +
          error,
      );
    return;
  }
  const newDriver = { ...request.body, id: randomUUID() };
  drivers.push(newDriver);
  drivers.sort((a, b) => b.points - a.points);
  response.status(200).send(newDriver);
});

//Receives a request that specifies the driver it wants to alter selecting it by it's ID
app.put(baseAPIRoute + "/drivers/:id", (request, response) => {
  const updateDriverSchema = Joi.object({
    name: Joi.string().min(3),
    team: Joi.string().min(3),
    points: Joi.number().min(0).max(1000).default(0),
  }).min(1); //.min(1) at the end makes it so the request body must have at least 1 parameter, otherwise the put request makes no sense
  const {error} = updateDriverSchema.validate(request.body, { abortEarly: false });
  if(error){
    response.status(400).send(error);
    return;
  }

  const { id } = request.params;
  const selectedDriver = drivers.find((driver) => driver.id === id);
  checkValidDriver(selectedDriver);

  for (const key in selectedDriver) {
    if (request.body[key]) {
      selectedDriver[key] = request.body(key);
    }
  }
  response.status(200).send(selectedDriver);
});

//Deletes a pilot based on his ID and then returns the updated list of drivers
app.delete(baseAPIRoute + "/drivers/:id", (request, response) => {
  const { id } = request.params;
  const selectedDriver = drivers.find((driver) => driver.id === id);
  checkValidDriver(selectedDriver);
  const index = drivers.indexOf(selectedDriver);
  drivers.splice(index, 1);
  response.status(200).send(drivers);
});

const port = 3000;

app.listen(port, () =>
  console.log(
    `API running successfully!\n\nAccess it on: \x1b[36mhttp://localhost:${port}`,
  ),
);
