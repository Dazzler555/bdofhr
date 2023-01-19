const express = require('express');
const cron = require('node-cron');
const https = require('https');
const url = process.env.URL;

const app = express();
app.get('/', (req, res) => {
    res.send('Server is running!');
});

cron.schedule('* * * * *', () => {
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            console.log("Server pinged at ${new Date()}. Response: ${data}");
        });
    }).on("error", (err) => {
        console.log("Error: ${err.message}");
    });
});

const server = app.listen(7000, () => {
    console.log("Server running");
});
