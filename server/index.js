const express = require("express");

require('dotenv').config();

const app = express();

const datagainerRoute = require("./routes/datagainer.route");
const clientRoute = require("./routes/client.route");
const connectDB = require("./db/mongo");

app.use(express.json());

app.use('/shadow/api/datagainer', datagainerRoute);
app.use('/shadow/api/client', clientRoute);

connectDB();

app.listen(6900, () => {
    console.log("Server is running on port 6900")
})