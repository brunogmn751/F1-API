import express from "express";
import { drivers } from "./data.js";
import { randomUUID } from "node:crypto";
import { request } from "node:http";

const baseAPIRoute = "/api/v1";

function sortList(){}

const app = express();

//Middleware that transforms json from requests int JS objects
app.use(express.json());

//Gets the full list of drivers
app.get(baseAPIRoute + "/drivers", (request, response) => {
  response.status(200).send(drivers);
});

//A GET request to /drivers/2 would return the driver in second place
app.get(baseAPIRoute+'/drivers/standings/:position', (request, response)=>{
    const position = Number(request.params.position);
    response.status(200).send(drivers[position - 1])
}) 

//Gets the driver by his ID
app.get(baseAPIRoute+'/drivers/:id' ,(request, response)=>{
    const {id} = request.params;
    const selectedDriver = drivers.find(driver => driver.id === id);
    response.status(200).send(selectedDriver);
})


// Adds a new driver to the database based on a JSON with name, points and team provided by the request
app.post(baseAPIRoute + '/drivers', (request, response)=>{
const newDriver = {...request.body, id: randomUUID()};
drivers.push(newDriver);
drivers.sort((a, b) => b.points - a.points);
response.status(200).send(newDriver);
})

//Receives a request that specifies the driver it wants to alter selecting it by it's ID 
app.put(baseAPIRoute + '/drivers/:id', (request, response)=>{
    const {id} = request.params;
    const selectedDriver = drivers.find(driver => driver.id === id);

    for (const key in selectedDriver){
        if(request.body[key]){
            selectedDriver[key] = request.body(key);
        }
    }
    response.status(200).send(selectedDriver)
})

//Deletes a pilot based on his ID and then returns the updated list of drivers 
app.delete(baseAPIRoute+'/drivers/:id', (request,response)=>{
    const {id} = request.params;
    const selectedDriver = drivers.find(driver => driver.id === id);
    const index = drivers.indexOf(selectedDriver);
    drivers.splice(index,1);
    response.status(200).send(drivers);
})



const port = 3000;

app.listen(port, () =>
  console.log(
    `API running successfully!\n\nAccess it on: \x1b[36mhttp://localhost:${port}`,
  ),
);
