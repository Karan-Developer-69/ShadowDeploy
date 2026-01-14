const refiner = ({ liveData, shadowData }) => {
    // Basic match logic
    const statusMatch = liveData.status === shadowData.status;
    const bodyMatch = JSON.stringify(liveData.bodyData) === JSON.stringify(shadowData.bodyData);

    const latencyDiffVal = liveData.responseTime - shadowData.responseTime;
    const latencyDiff = latencyDiffVal > 0 ? `+${latencyDiffVal}ms` : `${latencyDiffVal}ms`;

    return {
        id: `req_${Date.now().toString(36)}`,
        path: liveData.endpoint,
        method: liveData.method,
        liveStatus: liveData.status,
        shadowStatus: shadowData.status,
        latencyDiff: latencyDiff,
        match: statusMatch && bodyMatch,
        timestamp: liveData.timestamp,
        // Detailed data for potential drill-down
        details: {
            liveBody: liveData.bodyData,
            shadowBody: shadowData.bodyData,
            liveResponseTime: liveData.responseTime,
            shadowResponseTime: shadowData.responseTime
        }
    };
}

module.exports = refiner;
