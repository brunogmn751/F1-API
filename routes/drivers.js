import express from "express";
import { drivers } from "../data.js";
import { randomUUID } from "node:crypto";
import {
  validateDriverInfo,
  validateUpdateDriverInfo,
  validatePosition,
} from "../inputValidation.js";

const router = express.Router();

//Gets the full list of drivers
router.get("/", (request, response) => {
  response.status(200).send(drivers);
});

//A GET request to /drivers/standings/2 would return the driver in second place
router.get("/standings/:position", (request, response, next) => {
  const position = Number(request.params.position);
  const { error } = validatePosition(drivers, position);
  if (error) {
    const err = new Error();
    err.statusCode = 400;
    err.message = `The position must be a number between 1 and ${drivers.length}`;
    return next(err);
  }
  response.status(200).send(drivers[position - 1]);
});

//Gets the driver by his ID
router.get("/:id", (request, response, next) => {
  const { id } = request.params;
  const selectedDriver = drivers.find((driver) => driver.id === id);
  if (!selectedDriver) {
    const err = new Error();
    err.statusCode = 404;
    err.message = `The ID provided does'nt correspond to a driver on the database`;
    return next(err);
  }
  response.status(200).send(selectedDriver);
});

// Adds a new driver to the database based on a JSON with name, points and team provided by the request
router.post("/", (request, response, next) => {
  const { error, value } = validateDriverInfo(request.body);
  if (error) {
    const err = new Error();
    err.statusCode = 400;
    err.message = `It is required to provide a Name and a Team to register a new driver`;
    return next(err);
  }
  const newDriver = { ...value, id: randomUUID() };
  drivers.push(newDriver);
  drivers.sort((a, b) => b.points - a.points);
  response.status(200).send(newDriver);
});

//Receives a request that specifies the driver it wants to alter selecting it by it's ID
router.put("/:id", (request, response, next) => {
  const { error } = validateUpdateDriverInfo(request.body);
  if (error) {
    const err = new Error();
    err.statusCode = 400;
    err.message = `It is required to provide either a Name, Team or number of point to update a driver's info`;
    return next(err);
  }

  const { id } = request.params;
  const selectedDriver = drivers.find((driver) => driver.id === id);
  if (!selectedDriver) {
    response
      .status(404)
      .send("The ID provided does'nt correspond to a driver on the database");
    return next(err);
  }

  for (const key in selectedDriver) {
    if (request.body[key]) {
      selectedDriver[key] = request.body[key];
    }
  }
  response.status(200).send(selectedDriver);
});

//Deletes a pilot based on his ID and then returns the updated list of drivers
router.delete("/:id", (request, response, next) => {
  const { id } = request.params;
  const selectedDriver = drivers.find((driver) => driver.id === id);
  if (!selectedDriver) {
    const err = new Error();
    err.statusCode = 404;
    err.message = `The ID provided does'nt correspond to a driver on the database`;
    return next(err);
  }
  const index = drivers.indexOf(selectedDriver);
  drivers.splice(index, 1);
  response.status(200).send(drivers);
});

export default router;
