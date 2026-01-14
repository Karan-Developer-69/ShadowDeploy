const differenceModel = require("../models/differenc.model")

module.exports.createDifference = async (req, res) => {
    const { recentComparisons, detailedComparisons } = req.body;

    try {
        const difference = await differenceModel.create({
            recentComparisons,
            detailedComparisons
        });
        res.status(200).send({ message: 'difference created successfully.' })
    } catch (error) {
        res.status(500).send({ message: 'server error.' })
    }
}

module.exports.getDifference = async (req, res) => {
    try {
        const difference = await differenceModel.find()
        res.status(200).send(difference)
    } catch (error) {
        res.status(500).send({ message: 'server error.' })
    }
}