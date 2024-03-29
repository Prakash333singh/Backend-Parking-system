const mongoose = require("mongoose");

const parkingLotHeadSchema = new mongoose.Schema({
    headName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    toAssignLot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingLot',
        required: true 
    },
    assignedParkingLot: [{
        type: String
    }]
});

const LotHead = mongoose.model("LotHead", parkingLotHeadSchema);

module.exports = LotHead;