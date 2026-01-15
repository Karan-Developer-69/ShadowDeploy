const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    name: String,
    plan: {
        type: String,
        default: "Free",
        enum: ["Free", "Pro"]
    },
    tier: {
        type: String,
        default: "Startup",
        enum: ["Developer", "Startup", "Enterprise"]
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    liveUrl: String,
    shadowUrl: String,
    endpoints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "endpoints"
        }
    ]
});

module.exports = mongoose.model("projects", projectSchema);