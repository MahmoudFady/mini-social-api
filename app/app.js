require("dotenv").config();
const express = require("express");
const app = express();
// built in middlewares
const bodyParser = require("body-parser");
const morgan = require("morgan");
// use the middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
module.exports = app;
