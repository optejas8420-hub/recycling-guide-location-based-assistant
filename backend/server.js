const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve your frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// --- API Route to fetch material data ---
app.get('/api/materials/:id', (req, res) => {
    const itemId = req.params.id;
    const dataPath = path.join(__dirname, 'data', 'materials.json');

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading materials database:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            const materials = JSON.parse(data);
            const item = materials[itemId];

            if (item) {
                res.json(item);
            } else {
                res.status(404).json({ error: "Material not found" });
            }
        } catch (parseErr) {
            console.error("Error parsing materials JSON:", parseErr);
            res.status(500).json({ error: "Data formatting error" });
        }
    });
});

// --- API Route to fetch guide data ---
app.get('/api/guides/:slug', (req, res) => {
    const guideSlug = req.params.slug;
    const dataPath = path.join(__dirname, 'data', 'guides.json'); 
 
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading guides database:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            const guides = JSON.parse(data);
            const foundGuide = guides.find(g => g.slug === guideSlug);

            if (foundGuide) {
                res.json(foundGuide);
            } else {
                res.status(404).json({ error: "Guide not found" });
            }
        } catch (parseErr) {
            console.error("Error parsing guides JSON:", parseErr);
            res.status(500).json({ error: "Data formatting error" });
        }
    });
});

// --- API Route to fetch ALL map areas ---
app.get('/api/areas', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'areas.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            res.status(500).json({ error: "Data formatting error" });
        }
    });
});

// --- API Route to fetch ONE specific area ---
app.get('/api/areas/:slug', (req, res) => {
    const areaSlug = req.params.slug;
    const dataPath = path.join(__dirname, 'data', 'areas.json'); 
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const areas = JSON.parse(data);
            const foundArea = areas.find(a => a.slug === areaSlug);
            if (foundArea) res.json(foundArea);
            else res.status(404).json({ error: "Area not found" });
        } catch (parseErr) {
            res.status(500).json({ error: "Data formatting error" });
        }
    });
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Serving frontend from: ${path.join(__dirname, '../frontend')}`);
});