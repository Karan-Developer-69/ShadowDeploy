const express = require("express");
const router = express.Router();
// const refiner = require("../controller/refiner.controler");
const { ingestData } = require("../controller/dashboard.controller");

router.post("/", ingestData);


module.exports = router;