const express = require("express");
const { createProject } = require("../controller/project.controller");
const { createEndpoint } = require("../controller/endpoint.controller");
const { createDifference, getDifference } = require("../controller/differenc.controller");
const { createTraffic, getTraffic } = require("../controller/traffic.controller");
const router = express.Router();

router.post("/details", (req, res) => {
    res.json({
        shadowUrl: "http://localhost:3002",
    })
})

router.post('/project', createProject);
router.get('/project/:id', getProject);

router.post('/endpoint', createEndpoint);
router.get('/endpoint', getEndpoint);

router.post('/difference', createDifference);
router.get('/difference', getDifference);

router.post('/traffic', createTraffic);
router.get('/traffic', getTraffic);

module.exports = router