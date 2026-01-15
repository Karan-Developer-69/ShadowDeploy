const mongoose = require("mongoose");

const differenceScheme = new mongoose.Schema({
    recentComparisons: {
        type: [{
            id: String,
            path: String,
            method: String,
            liveStatus: Number,
            shadowStatus: Number,
            latencyDiff: String,
            match: Boolean
        }],
        default: []
    },
    projectId: {
        type: String,
        required: true,
        index: true
    },
    detailedComparisons: {
        type: [{
            meta: {
                id: String,
                timestamp: String,
                method: String,
                path: String
            },
            live: {
                status: Number,
                latency: Number,
                body: mongoose.Schema.Types.Mixed,
                headers: mongoose.Schema.Types.Mixed
            },
            shadow: {
                status: Number,
                latency: Number,
                body: mongoose.Schema.Types.Mixed,
                headers: mongoose.Schema.Types.Mixed
            },
            diffSummary: {
                statusMatch: Boolean,
                bodyMatch: Boolean,
                latencyDiff: Number,
                breakingScore: Number
            }
        }],
        default: []
    },
}, { timestamps: true });

module.exports = mongoose.model("differences", differenceScheme);