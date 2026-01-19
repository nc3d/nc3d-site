require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// 1. Serve static files from the build folder
app.use(express.static(DIST_DIR));

// 2. Handle React Routing (Fallthrough for anything not found above)
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});