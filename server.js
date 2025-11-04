const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log("Press Ctrl+C to stop the server");
});
