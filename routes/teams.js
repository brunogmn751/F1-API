import express from "express";
import { generateTeamsArray } from "../data.js";
import { validatePosition } from "../inputValidation.js";

const router = express.Router();


//Gets the full list of teams
router.get("/", (request, response) => {
  
  response.status(200).send(generateTeamsArray());
});

//A GET request to /teams/standings/2 would return the team in second place
router.get("/standings/:position", (request, response) => {
  const teams = generateTeamsArray();
  const position = Number(request.params.position);
  const {error} = validatePosition(teams, position)
  if (error) {
    response.status(400).send(error);
    return;
  }
  response.status(200).send(teams[position - 1]);
});

export default router;
