const TrafficModel = require('../models/traffic.model');
const DifferenceModel = require('../models/differenc.model');
const EndpointModel = require('../models/endpoint.model');
const ProjectModel = require('../models/project.model');

// Helper to calculate diff (simplified version based on testdata logic)
const calculateDiff = (live, shadow) => {
    // This is a placeholder logic. In a real scenario, deep comparison is needed.
    const statusMatch = live.status === shadow.status;
    const latencyDiff = shadow.responseTime - live.responseTime;
    const bodyMatch = JSON.stringify(live.bodyData) === JSON.stringify(shadow.bodyData);

    return {
        statusMatch,
        bodyMatch,
        latencyDiff,
        breakingScore: (!statusMatch || !bodyMatch) ? 100 : Math.abs(latencyDiff) > 100 ? 50 : 0 // Arbitrary scoring
    };
};

/**
 * Get user's project - prioritize header credentials, fallback to userId
 */
const getUserProject = async (req) => {
    const { validateProject } = require('./project.controller');

    // Try to get credentials from headers first
    const projectId = req.headers['x-project-id'];
    const apiKey = req.headers['x-api-key'];

    if (projectId && apiKey) {
        // Validate credentials and ensure they belong to this user
        const project = await validateProject(apiKey, projectId);
        if (project && project.userId === req.auth.userId) {
            return project;
        }
    }

    // Fallback: get first project by userId
    const project = await ProjectModel.findOne({ userId: req.auth.userId }).lean();
    return project;
};

module.exports.getTrafficStats = async (req, res) => {
    try {
        // Get user's project (with header credentials if available)
        const project = await getUserProject(req);
        if (!project) {
            return res.json({
                stats: { totalRequests: '0', shadowErrors: 0, avgLatency: '0ms', matchRate: '0%' },
                trends: { requestsChange: '0%', errorsChange: '0', latencyChange: '0ms', matchRateChange: '0%' }
            });
        }

        const traffic = await TrafficModel.findOne({ projectId: project.projectId }).lean();
        if (!traffic) {
            return res.json({
                stats: { totalRequests: '0', shadowErrors: 0, avgLatency: '0ms', matchRate: '0%' },
                trends: { requestsChange: '0%', errorsChange: '0', latencyChange: '0ms', matchRateChange: '0%' }
            });
        }

        res.json({ stats: traffic.stats || {}, trends: traffic.trends || {} });
    } catch (error) {
        console.error('Error fetching traffic stats:', error);
        res.status(500).json({ message: "Error fetching traffic stats" });
    }
};

module.exports.getTrafficLogs = async (req, res) => {
    try {
        const project = await getUserProject(req);
        if (!project) return res.json([]);

        const traffic = await TrafficModel.findOne({ projectId: project.projectId }).lean();
        if (!traffic) return res.json([]);

        res.json(traffic.liveLogs || []);
    } catch (error) {
        console.error('Error fetching traffic logs:', error);
        res.status(500).json({ message: "Error fetching traffic logs" });
    }
};

module.exports.getRecentDiffs = async (req, res) => {
    try {
        const project = await getUserProject(req);
        if (!project) return res.json({ recentComparisons: [], detailedComparisons: [] });

        const diffs = await DifferenceModel.findOne({ projectId: project.projectId }).lean();
        if (!diffs) return res.json({ recentComparisons: [], detailedComparisons: [] });

        // Return complete diff data structure
        res.json({
            recentComparisons: diffs.recentComparisons || [],
            detailedComparisons: diffs.detailedComparisons || []
        });
    } catch (error) {
        console.error('Error fetching differences:', error);
        res.status(500).json({ message: "Error fetching differences" });
    }
};

module.exports.getEndpoints = async (req, res) => {
    try {
        const project = await getUserProject(req);
        if (!project) return res.json([]);

        const endpoints = await EndpointModel.find({ projectId: project.projectId }).lean();
        res.json(endpoints);
    } catch (error) {
        console.error('Error fetching endpoints:', error);
        res.status(500).json({ message: "Error fetching endpoints" });
    }
};

// Ingest Data Controller
module.exports.ingestData = async (req, res) => {
    try {
        const { liveData, shadowData, clientInfo } = req.body;

        if (!liveData || !shadowData || !clientInfo) {
            return res.status(400).json({ message: "Missing liveData, shadowData, or clientInfo" });
        }

        const { apiKey, projectId } = clientInfo;
        const liveUrl = liveData?.liveUrl;
        const { validateProject } = require('./project.controller');
        const project = await validateProject(apiKey, projectId, liveUrl);
        if (!project) {
            return res.status(401).json({ message: "Invalid apiKey or projectId" });
        }

        const diffResult = calculateDiff(liveData, shadowData);

        // 1. Update Traffic Logs
        const logEntry = {
            id: `req_${Date.now().toString(36)}`,
            time: new Date(liveData.timestamp).toLocaleTimeString(),
            method: liveData.method,
            path: liveData.endpoint,
            live: liveData.status,
            shadow: shadowData.status,
            latencyLive: liveData.responseTime,
            latencyShadow: shadowData.responseTime
        };

        let traffic = await TrafficModel.findOne({ projectId });
        if (!traffic) {
            traffic = new TrafficModel({ projectId, stats: {}, trends: {}, liveLogs: [] });
        }
        traffic.liveLogs.unshift(logEntry);
        if (traffic.liveLogs.length > 50) traffic.liveLogs.pop(); // Keep last 50

        // Update Stats (Simplified aggregation)
        const totalRequests = (parseInt(traffic.stats.totalRequests || "0") + 1).toString(); // Naive counter
        const shadowErrors = (traffic.stats.shadowErrors || 0) + (shadowData.status >= 500 ? 1 : 0);

        traffic.stats = {
            ...traffic.stats,
            totalRequests: totalRequests, // In reality, this should be better format
            shadowErrors: shadowErrors,
            avgLatency: `${Math.round((liveData.responseTime + shadowData.responseTime) / 2)}ms`, // Moving avg would be better
            matchRate: diffResult.statusMatch && diffResult.bodyMatch ? "100%" : "0%" // Very naive
        };
        await traffic.save();


        // 2. Update Differences
        let differences = await DifferenceModel.findOne({ projectId });
        if (!differences) {
            differences = new DifferenceModel({ projectId });
        }

        const comparisonEntry = {
            id: logEntry.id,
            path: liveData.endpoint,
            method: liveData.method,
            liveStatus: liveData.status,
            shadowStatus: shadowData.status,
            latencyDiff: `${diffResult.latencyDiff > 0 ? '+' : ''}${diffResult.latencyDiff}ms`,
            match: diffResult.statusMatch && diffResult.bodyMatch
        };

        differences.recentComparisons.unshift(comparisonEntry);
        if (differences.recentComparisons.length > 50) differences.recentComparisons.pop();

        // Save detailed comparison data for diff page
        // Ensure body and headers are objects, not strings
        const parseIfString = (data) => {
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return {};
                }
            }
            return data || {};
        };

        const detailedEntry = {
            meta: {
                id: logEntry.id,
                timestamp: new Date(liveData.timestamp).toLocaleTimeString(),
                method: liveData.method,
                path: liveData.endpoint
            },
            live: {
                status: liveData.status,
                latency: liveData.responseTime,
                body: parseIfString(liveData.bodyData),
                headers: parseIfString(liveData.headers)
            },
            shadow: {
                status: shadowData.status,
                latency: shadowData.responseTime,
                body: parseIfString(shadowData.bodyData),
                headers: parseIfString(shadowData.headers)
            },
            diffSummary: {
                statusMatch: diffResult.statusMatch,
                bodyMatch: diffResult.bodyMatch,
                latencyDiff: diffResult.latencyDiff,
                breakingScore: diffResult.breakingScore
            }
        };

        differences.detailedComparisons.unshift(detailedEntry);
        if (differences.detailedComparisons.length > 20) differences.detailedComparisons.pop();

        await differences.save();

        // 3. Update Endpoints
        let endpoint = await EndpointModel.findOne({ projectId, path: liveData.endpoint, method: liveData.method });
        if (!endpoint) {
            endpoint = new EndpointModel({
                projectId,
                method: liveData.method,
                path: liveData.endpoint,
                traffic24h: 0,
                trend: 0,
                avgLatencyLive: 0,
                avgLatencyShadow: 0,
                errorRateLive: 0,
                errorRateShadow: 0,
                status: "healthy"
            });
        }

        // Update basic metrics (simplified)
        endpoint.traffic24h += 1;
        endpoint.avgLatencyLive = Math.round((endpoint.avgLatencyLive * 9 + liveData.responseTime) / 10); // Simple weighting
        endpoint.avgLatencyShadow = Math.round((endpoint.avgLatencyShadow * 9 + shadowData.responseTime) / 10);
        endpoint.lastActive = new Date().toISOString();
        // status logic...
        if (diffResult.breakingScore > 50) endpoint.status = "degraded";
        else endpoint.status = "healthy";

        await endpoint.save();

        res.json({ message: "Data ingested successfully", diffResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error ingesting data" });
    }
};
