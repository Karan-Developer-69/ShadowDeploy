const mongoose = require("mongoose");

const differenceScheme = new mongoose.Schema({
    recentComparisons: {
        type: Array,
        default: []
    },
    detailedComparisons: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model("differences", differenceScheme);