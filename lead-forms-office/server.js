const express = require("express");
const path = require("path");
const app = express();
const PORT = 4000;

// Serve index.html from root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve other static files (if you add CSS/JS later)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
