const express = require("express");

const router = express.Router();

router.post("/details", (req, res) => {
    res.json({
        shadowUrl: "http://localhost:3002",
    })
})

module.exports = router