const express = require('express');
const cors = require('cors');
const Shadow = require('./shadow/shadow');

const app = express();
const shadow = new Shadow({
    apiKey: "sk_25uh2s8g0",
    projectId: "proj_m5nza2j8u"
});
require('dotenv').config()
app.use(cors());
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