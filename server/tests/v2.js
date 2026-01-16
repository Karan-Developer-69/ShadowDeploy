const express = require('express');

const app = express();
const shadow = express();

// app.get('/api/app', (req, res) => {
//     res.json({ message: 'Hello, World!' });
// })
// app.get('/endpoints', (req, res) => {
//     res.json({ message: 'Hello, World!' });
// })
// app.get('/diffs/recent', (req, res) => {
//     res.json({ message: 'Hello, World!' });
// })
// app.get('/traffic/logs', (req, res) => {
//     res.json({ message: 'Hello, World!' });
// }
// app.get('/traffic/stats', (req, res) => {
//     res.json({ message: 'Hello, World!' });
// })

shadow.get('/api/app', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 4000));

    res.json({ message: '#shadowURL --> Hello from Shadow Server!' });
})

shadow.get('/endpoints', (req, res) => {
    res.json({ message: 'Hello, World!' });
})
shadow.get('/diffs/recent', (req, res) => {
    res.json({ message: 'Hello, World!' });
})
shadow.get('/traffic/logs', (req, res) => {
    res.json({ message: 'Hello, World!' });
})
shadow.get('/traffic/stats', (req, res) => {
    res.json({ message: 'Hello, World!' });
})

// app.listen(3001, () => {
//     console.log('Server is running on port 3001');
// });

shadow.listen(3002, () => {
    console.log('Shadow Server is running on port 3002`');
});