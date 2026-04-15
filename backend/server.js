const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON parsing
app.use(express.json());

// Serve static files from the frontend directory
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Utility to read JSON files safely
const readJsonFile = (filename) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filename}:`, err);
        return [];
    }
};

// API: Get recycling centers
app.get('/api/centers', (req, res) => {
    const centers = readJsonFile('centers.json');
    res.json(centers);
});

// API: Get materials
app.get('/api/materials', (req, res) => {
    const materials = readJsonFile('materials.json');
    res.json(materials);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running properly at http://localhost:${PORT}`);
});
