const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
    stats: {
        type: Object,
        default: {}
    },
    trends: {
        type: Object,
        default: {}
    },
    liveLogs: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("traffics", trafficSchema)