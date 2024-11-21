// require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const { LEDModel } = require("./led");
const cors = require('cors');  

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://iotuser:oe0QRvauitHhhBcX@cluster0.s9qw4.mongodb.net/IOT")
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// GET /led-status
app.get('/led-status', async (req, res) => {
    try {
        let led = await LEDModel.findOne({ led: "led" });
        if (!led) {
            return res.json({ status: "off" }); // Default status if no entry found
        }
        res.json({ status: led.status });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching LED status' });
    }
});

// POST /update-led-status
app.post('/update-led-status', async (req, res) => {
    const { status } = req.body;

    if (status !== 'on' && status !== 'off') {
        return res.status(400).json({ error: 'Invalid status. Only "on" or "off" are allowed.' });
    }

    try {
        const updatedLed = await LEDModel.findOneAndUpdate(
            { led: "led" }, 
            { status }, 
            { new: true, upsert: true } // Creates a new document if it doesn't exist
        );
        res.json({ message: `Button status updated to ${status}`, data: updatedLed });
    } catch (error) {
        res.status(500).json({ error: 'Error updating LED status' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
