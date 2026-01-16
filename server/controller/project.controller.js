const projectModel = require("../models/project.model");
const { v4: uuidv4 } = require('uuid');

module.exports.createProject = async (req, res) => {
    const { name, liveUrl, shadowUrl } = req.body;
    const userId = req.auth.userId; // Get from JWT token

    try {
        // Check if user already has a project with this name
        const existingProject = await projectModel.findOne({ userId, name });

        if (existingProject) {
            return res.status(200).json({
                message: "Project already exists. Returning existing project.",
                project: existingProject
            });
        }

        // Generate secure UUIDs for project ID and API key
        const generatedProjectId = "proj_" + uuidv4();
        const generatedApiKey = "sk_" + uuidv4();

        const project = await projectModel.create({
            projectId: generatedProjectId,
            apiKey: generatedApiKey,
            userId,
            name,
            liveUrl,
            shadowUrl,
        });

        res.status(200).json({ message: "Project created successfully.", project })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." })
    }
}

module.exports.validateProject = async (apiKey, projectId, liveUrl = null) => {
    try {

        console.log("3. API proj", apiKey, projectId)
        const project = await projectModel.findOne({ apiKey, projectId });

        if (project && liveUrl && project.liveUrl !== liveUrl) {
            project.liveUrl = liveUrl;
            await project.save();
        }

        console.log("4. API proj", apiKey, projectId, project)
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