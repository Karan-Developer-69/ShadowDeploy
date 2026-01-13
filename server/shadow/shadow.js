const { default: axios } = require("axios");

class Shadow {
    constructor(apiKey, projectId) {
        this.apiKey = apiKey;
        this.projectId = projectId
        this.shadowUrl = 'http://localhost:6900'
    }

    async callWithTime(config) {
        const start = Date.now();
        const response = await axios(config);
        const end = Date.now();

        return {
            status: response.status,
            headers: response.headers,
            data: response.data,
            responseTime: end - start,
        };
    }



    shadowOpration = async (liveData, shadowData) => {
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
        console.log("------DATA SENDED TO SHADOW SERVER------");
    }

    proxyHandler = async (req, res, next) => {

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
            const serverResponse = fetch(`${this.shadowUrl}/shadow/api/client/details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    apiKey: this.apiKey,
                    projectId: this.projectId,
                }),
            })
                .then(r => {
                    console.log("shadow server res:", r)
                    return r.json()
                })
                .then(serverRes => {
                    console.log("refined res:", serverRes)
                    const secondUrl = serverRes.shadowUrl;
                    console.log("fetched URL: ", secondUrl)
                    const shadowUrl = secondUrl + path;
                    this.callWithTime({
                        method: req.method,
                        url: shadowUrl,
                        headers: req.headers,
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
                        this.shadowOpration(fullResponseData, shadowData);
                    }).catch(err => {
                        console.log("Shadow error:", err.message);
                    });
                }

                );

        })

        // IMPORTANT: live request ko aage jaane do
        next();
    };

}

module.exports = Shadow;