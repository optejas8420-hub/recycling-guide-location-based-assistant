const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, "public")));

// Routes for pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/plastic", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "plastic.html"));
});

app.get("/materials", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "materials.html"));
});

app.get("/map", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "map.html"));
});

app.get("/guides", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "guides.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});