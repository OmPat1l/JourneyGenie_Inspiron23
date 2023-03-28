const express = require("express");
const app = express();
const fs = require("fs");
let data1 = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));
app.use(express.json());
let log = 0;
let lat = 0;
app.get();
