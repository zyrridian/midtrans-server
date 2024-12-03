const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Midtrans configuration
const SERVER_KEY = '<server-key>'; // Replace with your Sandbox Server Key
const IS_PRODUCTION = false;

const API_URL = IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Route to handle `/charge` requests
app.post('/charge', async (req, res) => {
    try {
        const requestBody = req.body;

        // Call Midtrans API using Axios
        const response = await axios.post(API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${Buffer.from(SERVER_KEY + ':').toString('base64')}`,
            },
        });

        // Forward the Midtrans response back to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

// Default route to handle incorrect paths
app.use((req, res) => {
    res.status(404).send('Path not found. Use POST /charge.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
