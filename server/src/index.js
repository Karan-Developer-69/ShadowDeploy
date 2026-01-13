const express = require('express');
const { route } = require('../routes/routes');
const app = express();
const port = 3000;


app.post('/shadow', (req, res) => {
  const { liveData, shadowData } = req.body;



  console.log("Shadow Analatics :", refinedData)
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 