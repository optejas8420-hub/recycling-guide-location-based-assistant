const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

// API Route to fetch item data
app.get('/api/materials/:id', (req, res) => {
    const itemId = req.params.id;
    const dataPath = path.join(__dirname, 'data', 'materials.json');

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading database:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const materials = JSON.parse(data);
        const item = materials[itemId];

        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: "Material not found" });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Serving frontend from: ${path.join(__dirname, '../frontend')}`);
});