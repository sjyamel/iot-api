const express = require('express');
const { LocalStorage } = require('node-localstorage');
const cors = require('cors');  
// Initialize localStorage
const localStorage = new LocalStorage('/tmp/scratch');

const app = express();
const PORT = 3000;
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to view the button status
app.get('/led-status', (req, res) => {
  // Get status from localStorage
  const buttonStatus = localStorage.getItem('buttonStatus') || 'off'; // default is 'off' if not set
  res.json({ status: buttonStatus });
});

// Endpoint to update the button status
app.post('/update-led-status', (req, res) => {
  const { status } = req.body;

  if (status !== 'on' && status !== 'off') {
    return res.status(400).json({ error: 'Invalid status. Only "on" or "off" are allowed.' });
  }

  // Update status in localStorage
  localStorage.setItem('buttonStatus', status);

  res.json({ message: `Button status updated to ${status}` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
