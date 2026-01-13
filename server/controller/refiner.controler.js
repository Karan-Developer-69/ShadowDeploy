const refiner = ({ liveData, shadowData }) => {
    const refinedData = {};
    if (liveData.statusCode && shadowData.statusCode) {
        refinedData.statusCode = {
            live: liveData.statusCode,
            shadow: shadowData.statusCode,
            result: liveData.statusCode === shadowData.statusCode ? "Pass" : "Fail",
        }
    }
    if (liveData.responseTime && shadowData.responseTime) {
        refinedData.responseTime = {
            live: liveData.responseTime,
            shadow: shadowData.responseTime,
            result: liveData.responseTime === shadowData.responseTime ? "Pass" : "Fail",
        }
    }
    return refinedData;
}

module.exports = refiner;
