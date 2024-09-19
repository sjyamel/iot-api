const mongoose = require("mongoose");

const LEDSchema = mongoose.Schema({
    status: {
        type: String,
    },
    led: {
        type: String
    }
});

module.exports = mongoose.model("LEDs", LEDSchema);