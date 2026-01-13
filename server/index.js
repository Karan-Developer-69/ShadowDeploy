const express = require("express");

const app = express();

const datagainerRoute = require("./routes/datagainer.route");
const clientRoute = require("./routes/client.route");

app.use(express.json())

app.use('/shadow/api/datagainer', datagainerRoute);
app.use('/shadow/api/client', clientRoute)
app.listen(6900, () => {
    console.log("Server is running on port 6900")
})