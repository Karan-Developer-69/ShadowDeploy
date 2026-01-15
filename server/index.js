const express = require("express");

require('dotenv').config();

const app = express();
const cors = require('cors');

const datagainerRoute = require("./routes/datagainer.route");
const clientRoute = require("./routes/client.route");
const connectDB = require("./db/mongo");

const PORT = process.env.PORT || 6900

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Routes
app.use('/shadow/api/datagainer', datagainerRoute);
app.use('/shadow/api/client', clientRoute);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: err.name || 'Error',
        message: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT)
    console.log("Environment:", process.env.NODE_ENV || 'development')
    if (process.env.CLERK_SECRET_KEY) {
        console.log("✅ Clerk authentication enabled")
    } else {
        console.warn("⚠️  CLERK_SECRET_KEY not found - authentication will fail!")
    }
})