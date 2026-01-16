const express = require('express');
const Shadow = require('shadow-deploy-client');

const app = express();

// TODO: Replace with environment variables (SHADOW_API_KEY and SHADOW_PROJECT_ID)
const shadow = new Shadow({
    apiKey: "sk_126710d9-3e42-408c-8490-2bd4d9453c7d",
    projectId: "proj_a197f22e-b9fe-416b-adb2-3e53d67eb643"
});

require('dotenv').config()
app.use(express.json());
app.use(shadow.proxyHandler);

app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
})

app.get('/api/app', (req, res) => {
    res.json({ message: '#liveURL --> Hello, World!' });
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});