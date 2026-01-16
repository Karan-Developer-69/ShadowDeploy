const { default: axios } = require("axios");

class Shadow {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.projectId = config.projectId;
        this.shadowUrl = 'https://shadow-api-k2df.onrender.com';

        if (!this.apiKey || !this.projectId) {
            console.error("Shadow Error: apiKey and projectId are required.");
        }
    }

    async callWithTime(config) {
        const start = Date.now();
        try {
            const response = await axios(config);
            const end = Date.now();
            return {
                status: response.status,
                headers: response.headers,
                data: response.data,
                responseTime: end - start,
            };
        } catch (error) {
            const end = Date.now();
            return {
                status: error.response ? error.response.status : 500,
                headers: error.response ? error.response.headers : {},
                data: error.response ? error.response.data : error.message,
                responseTime: end - start,
            };
        }
    }



    shadowOperation = async (liveData, shadowData) => {
        if (!this.apiKey || !this.projectId) return;

        try {
            const response = await fetch(`${this.shadowUrl}/shadow/api/datagainer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    liveData,
                    shadowData,
                    clientInfo: {
                        apiKey: this.apiKey,
                        projectId: this.projectId,
                    }
                }),
            });
            console.log("------DATA SENT TO SHADOW SERVER------");
        } catch (error) {
            console.error("Shadow Operation Failed:", error.message);
        }
    }

    proxyHandler = async (req, res, next) => {
        if (!this.apiKey || !this.projectId) {
            return next();
        }


        const path = req.originalUrl;

        // Store original methods
        const oldJson = res.json;
        const oldSend = res.send;

        let responseBody;

        // Override res.json
        res.json = function (body) {
            responseBody = body;
            return oldJson.call(this, body);
        };

        // Override res.send
        res.send = function (body) {
            responseBody = body;
            return oldSend.call(this, body);
        };

        const start = Date.now();



        res.on("finish", () => {
            const end = Date.now();
            console.log("✅ Response sent to user");
            const liveUrl = req.get('referer') ? `https://${req.get('referer')}${path}` : `http://${req.get('host')}`;
            const fullResponseData = {
                bodyData: responseBody,
                status: res.statusCode,
                responseTime: end - start,
                method: req.method,
                timestamp: new Date().toISOString(),
                endpoint: path,
                headers: res.getHeaders(),
                liveUrl,
            };

            // 🔥 Shadow call AFTER response
            // Validate credentials first
            fetch(`${this.shadowUrl}/shadow/api/client/details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    apiKey: this.apiKey,
                    projectId: this.projectId,
                    liveUrl: liveUrl
                }),
            })
                .then(r => {
                    console.log("Shadow validation response:", r);
                    if (!r.ok) throw new Error(`Validation Error: ${r.statusText}`);
                    return r.json();
                })
                .then(serverRes => {
                    console.log("Shadow validation response:", serverRes);
                    if (!serverRes.shadowUrl) {
                        console.warn("Shadow Warning: Invalid credentials or shadow URL not returned.");
                        return;
                    }

                    // Credentials validated, proceeding...
                    const secondUrl = serverRes.shadowUrl;
                    const shadowUrl = secondUrl + path;

                    this.callWithTime({
                        method: req.method,
                        url: shadowUrl,
                        headers: { ...req.headers, Origin: undefined }, // Exclude Origin to mimic Postman
                        data: req.body,
                        timeout: 6000,
                    }).then(shadowResponse => {
                        const shadowData = {
                            bodyData: shadowResponse.data,
                            status: shadowResponse.status,
                            responseTime: shadowResponse.responseTime,
                            method: req.method,
                            timestamp: new Date().toISOString(),
                            endpoint: path,
                            shadowUrl: secondUrl,
                        }
                        this.shadowOperation(fullResponseData, shadowData);
                    }).catch(err => {
                        console.log("Shadow execution error:", err.message);
                    });
                })
                .catch(err => console.error("Shadow setup/validation error:", err.message));

        })

        // IMPORTANT: live request ko aage jaane do
        next();
    };

}

module.exports = Shadow;