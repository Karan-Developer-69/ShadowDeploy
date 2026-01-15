const projectModel = require("../models/project.model");

module.exports.createProject = async (req, res) => {
    const { name, liveUrl, shadowUrl } = req.body;
    const userId = req.auth.userId; // Get from JWT token

    try {
        const generatedProjectId = "proj_" + Math.random().toString(36).substr(2, 9);
        const generatedApiKey = "sk_" + Math.random().toString(36).substr(2, 9);

        const project = await projectModel.create({
            projectId: generatedProjectId,
            apiKey: generatedApiKey,
            userId,
            name,
            liveUrl,
            shadowUrl,
        });

        res.status(200).json({ message: "project created sucessfully.", project })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error." })
    }
}

module.exports.validateProject = async (apiKey, projectId) => {
    try {
        const project = await projectModel.findOne({ apiKey, projectId });
        return project;
    } catch (error) {
        return null;
    }
}

module.exports.getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await projectModel.findOne({ projectId: id });
        res.status(200).json(project)
    } catch (error) {
        res.status(500).send({ message: "server error." })
    }
}

module.exports.getUserProjects = async (req, res) => {
    const userId = req.auth.userId; // Get from JWT token
    try {
        const projects = await projectModel.find({ userId }).lean();
        res.status(200).json(projects)
    } catch (error) {
        console.error("Error fetching user projects:", error);
        res.status(500).json({ message: "server error." })
    }
}

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, liveUrl, shadowUrl } = req.body;
    const userId = req.auth.userId; // Get from JWT token

    try {
        // Find the project and verify ownership
        const project = await projectModel.findOne({ projectId: id });

        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        // Verify user owns the project
        if (project.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized. You don't own this project." });
        }

        // Update only allowed fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
        if (shadowUrl !== undefined) updateData.shadowUrl = shadowUrl;

        // Update the project
        const updatedProject = await projectModel.findOneAndUpdate(
            { projectId: id },
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Project updated successfully.",
            project: updatedProject
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Server error." });
    }
}