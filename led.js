const mongoose = require("mongoose");

const LEDSchema = mongoose.Schema({
    status: {
        type: String,
    },
    led: {
        type: String
    }
});

exports.LEDModel = mongoose.model("LEDs", LEDSchema);