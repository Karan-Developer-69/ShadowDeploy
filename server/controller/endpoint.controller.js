const endpointModel = require("../models/endpoint.model")

module.exports.createEndpoint = async (req, res) => {

    const { projectId, method, path, traffic24h, trend, avgLatencyLive, avgLatencyShadow, errorRateLive, errorRateShadow, status, lastActive } = req.body;

    try {
        const endpoint = await endpointModel.create({
            projectId,
            method,
            path,
            traffic24h,
            trend,
            avgLatencyLive,
            avgLatencyShadow,
            errorRateLive,
            errorRateShadow,
            status,
            lastActive
        })

        res.status(200).json({ message: "endpoint created successfully" })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}

module.exports.getEndpoint = async (req, res) => {
    try {
        const endpoint = await endpointModel.find()
        res.status(200).send(endpoint)
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}