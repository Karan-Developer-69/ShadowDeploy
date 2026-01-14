const express = require("express");
const router = express.Router();
const refiner = require("../controller/refiner.controler");

router.post("/", (req, res) => {
    const data = req.body;
    // console.log(data)
    const refinedData = refiner(data);

    console.log("Refined & Stored:", refinedData.id);
    res.json(refinedData);
});


module.exports = router;