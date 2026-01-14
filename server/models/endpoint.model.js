const mongoose = require("mongoose")

const endpointSchema = new mongoose.Schema({
    projectId: String,
    method: String,
    path: String,
    traffic24h: Number,
    trend: Number,
    avgLatencyLive: Number,
    avgLatencyShadow: Number,
    errorRateLive: Number,
    errorRateShadow: Number,
    status: String,
    lastActive: {
        type: String,
        default: new Date().toISOString()
    }
})

module.exports = mongoose.model("endponts", endpointSchema)