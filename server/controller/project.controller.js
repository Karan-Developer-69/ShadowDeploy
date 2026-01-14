const projectModel = require("../models/project.model");

module.exports.createProject = async (req, res) => {
    const { name, liveUrl, shadowUrl } = req.body;

    try {
        const project = await projectModel.create({
            name,
            liveUrl,
            shadowUrl,
        });

        res.status(200).json({ message: "project created sucessfully." })
    } catch (error) {
        res.status(500).json({ message: "server error." })
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