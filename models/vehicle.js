const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    parkingLotID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingLot',
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    enteredAt: {
        type: String
    },
    exitedAt: {
        type: String
    },
    totalTime: {
        type: Number
    },
    totalSum: {
        type: Number
    }
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;