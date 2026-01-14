const trafficModel = require('../models/traffic.model');

module.exports.createTraffic = async (req, res) => {
    const { stats, trends, liveLogs } = req.body;

    try {
        const traffic = await trafficModel.create({
            stats,
            trends,
            liveLogs
        })
        res.status(200).send({ message: 'traffic created successfully.' })
    } catch (error) {
        res.status(500).send({ message: 'server error.' })
    }
};

module.exports.getTraffic = async (req, res) => {
    try {
        const traffic = await trafficModel.find();
        res.status(200).send(traffic)
    } catch (error) {
        res.stats(500).send({ message: "server error." })
    }
}