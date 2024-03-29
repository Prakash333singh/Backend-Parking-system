const mongoose = require("mongoose");

const parkingLotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    currHold: {
        type: Number,
        default: 0,
    },
    vehicles: [{
        type: String
    }],
    hourlyRate: {
        car: {
            type: Number,
            default: 50
        },
        bike: {
            type: Number,
            default: 25
        }
    },
    totalMoney: {
        type: Number,
        default: 0
    }
});

const ParkingLot = mongoose.model("ParkingLot", parkingLotSchema);

module.exports = ParkingLot;