const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        unique: true  // Ensure projectId is unique
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
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

// Compound index on userId + name for faster duplicate checks
projectSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model("projects", projectSchema);