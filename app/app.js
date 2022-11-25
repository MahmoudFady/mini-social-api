require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { DATA_BASE_URL } = process.env;
// built in middlewares
const bodyParser = require("body-parser");
const morgan = require("morgan");
// use the middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
// connect to data base
mongoose
  .connect(DATA_BASE_URL)
  .then(() => {
    console.log("- ".repeat(15));
    console.log("connection to data base established");
    console.log("data base url : " + DATA_BASE_URL);
    console.log("- ".repeat(15));
  })
  .catch((err) => {
    console.log("- ".repeat(15));
    console.log("connected to data base faild");
    console.log(err.mongoose);
    console.log("- ".repeat(15));
  });
module.exports = app;
