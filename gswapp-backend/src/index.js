require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Debug Middleware to log requests
app.use((req, res, next) => {
    console.log(`Global debug: method=${req.method}, url="${req.url}", headers=${JSON.stringify(req.headers)}`);
    next();
});



// Register wallet-related routes
app.use('/api', walletRoutes);

// Health check
app.get('/', (req, res) => res.send('Gswapp API is running.'));

// Catch-All route
app.all('*', (req, res) => {
    console.log(`Unhandled request: ${req.method} ${req.url}`);
    res.status(404).send('Route not found');
});

// Start the server
app.listen(port, () => {
    console.log(`Gswapp API is running at http://localhost:${port}`);
});
