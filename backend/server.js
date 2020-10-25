"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser')
const { stock, customers } = require("./data/inventory");

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  .post("/order", (req, res) => {

    const order = req.body.order;
    const shirtSize = req.body.size;
    const givenName = req.body.givenName;
    const surName = req.body.surname;
    const email = req.body.email;
    const address = req.body.address;
    const country = req.body.country;
    const emailRegex = /^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$/;
    let repeatCustomer = false;
    let errorType = false;

    // check if repeat customer

    customers.map((person) => {
      if (person.email === email) { repeatCustomer = true };
      if (person.givenName.toLowerCase() === givenName.toLowerCase() && person.surname.toLowerCase() === surName.toLowerCase()) { repeatCustomer = true };
      if (person.address === address) { repeatCustomer = true };
    });

    // rejected cases

    if (country.toLowerCase() !== "canada") {
      errorType = "Undeliverable";
    } else if (!emailRegex.test(email)) {
      errorType = "missing-data";
    } else if (repeatCustomer) {
      errorType = 'repeat-customer';
    } else if (order == "tshirt" && stock.shirt[shirtSize] == "0") {
      errorType = 'unavailable';
    } else if (stock[order] == "0") {
      errorType = 'unavailable';
    }

    if (errorType) {
      console.log(errorType)
      res.status(400).json({
        status: "error",
        error: errorType,
      });
    } else {
      console.log("success!")
      res.status(200).json({
        status: "success",
      });
    }
  })
  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
