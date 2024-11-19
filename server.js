const express = require('express');
const mongoose = require("mongoose");
const {LEDModel} = require("./led");
const { LocalStorage } = require('node-localstorage');
const cors = require('cors');  
// Initialize localStorage


const app = express();
const PORT = 3000;
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

mongoose
  .connect('mongodb+srv://iotuser:oe0QRvauitHhhBcX@cluster0.s9qw4.mongodb.net/IOT')
  .then(() => console.log('DB connection successful!'));

// Endpoint to view the button status
app.get('/led-status', async(req, res) => {
  // Get status from localStorage
  let led;
  led = await LEDModel.find({led: "led"});
  if(!led[0]){
    led = await LEDModel.create({led: "led", status: "off"});
  }
  const buttonStatus = led[0]?.status; // default is 'off' if not set
  res.json({ status: buttonStatus });
});

// Endpoint to update the button status
app.post('/update-led-status', async (req, res) => {
  const { status } = req.body;
  
  if (status !== 'on' && status !== 'off') {
    return res.status(400).json({ error: 'Invalid status. Only "on" or "off" are allowed.' });
  }

  // Update status in localStorage
  led = await LEDModel.find({led: "led"});
  await LEDModel.findByIdAndUpdate(led[0]?.id, {status: status});

  res.json({ message: `Button status updated to ${status}` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
