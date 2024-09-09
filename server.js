const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Load Rashi configuration
const rashiConfig = JSON.parse(fs.readFileSync('rashi-config.json', 'utf-8'));

// In-memory data storage for names
let names = [];

let selectedRashi = "Dhanu"; // Default Rashi, can be configured before running the server


// Route to submit a new name
app.post('/submit-name', (req, res) => {
  const { name, provider } = req.body;

  if (!name || !provider) {
    return res.status(400).send('Name and provider are required');
  }

// Validate if the name starts with a valid letter for the selected Rashi
const allowedPrefixes = rashiConfig[selectedRashi];
const nameUpper = name.toUpperCase(); // Convert name to uppercase for case-insensitive comparison


  // Check if the name starts with any of the allowed prefixes
const isValid = allowedPrefixes.some(prefix => nameUpper.startsWith(prefix.toUpperCase()));


  if (!isValid) {
    return res.status(400).send(`The name must start with one of the following letters: ${allowedPrefixes.join(', ')}`);
  }

  // Store the name if validation passes
  names.push({ name, provider, likes: 0 });
  res.status(200).send('Name submitted successfully');
});

// Route to like a name
app.post('/like-name', (req, res) => {
  const { name } = req.body;
  const nameEntry = names.find(n => n.name === name);

  if (nameEntry) {
    nameEntry.likes += 1;
    res.status(200).send('Name liked successfully');
  } else {
    res.status(404).send('Name not found');
  }
});

// Route to get all names and likes
app.get('/get-names', (req, res) => {
  res.json(names);
});

// Start the server
app.listen(port, () => {
  selectedRashi = process.env.RASHI || "Dhanu"; // Allow Rashi to be configured via environment variable
  console.log(`Server running at http://localhost:${port}`);
});
