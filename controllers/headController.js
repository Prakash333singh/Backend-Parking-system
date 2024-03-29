const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ParkingLotHead = require("../models/parkingLotHead");
const ParkingLot = require("../models/parkingLots");
const Vehicle = require("../models/vehicle");

dotenv.config();

const loginHead = async(req,res) => {
    try{
        const headEmail = req.body.email;
        const head = await ParkingLotHead.findOne({email: headEmail});
        if(!head){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Head does not exist",
                "data": null
            });
        }

        const isCorrectPass = await bcrypt.compare(req.body.password, head.password);
        if(!isCorrectPass){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Incorrect password",
                "data": null
            });
        }

        const token = jwt.sign({_id: head._id}, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        res.header({token: token});

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Login successful",
            "data": [head]
        });

    } catch(err){
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

const logoutHead = async(req,res) => {
    return res.status(200).send({
        "success": true,
        "error_code": null,
        "message": "Logout successful",
        "data": []
    });
};


const enterVehicle = async(req,res) => {

    try{
        const currHead = req.head;

        const lotID = req.body.parkingLotID;
        const parkingLot = await ParkingLot.findById({_id: lotID});

        if(!parkingLot){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot does not exist",
                "data": null
            });
        }

        let isHead = false;
        if(currHead.assignedParkingLot.includes(lotID))
        isHead = true;

        if(!isHead){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This parking lot is not assigned to you",
                "data": null
            });
        }

        if(req.body.vehicleType.toLowerCase() !== "car" && req.body.vehicleType.toLowerCase() !== "bike"){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot allows only bike and car",
                "data": null
            });
        }
        
        const indexToAdd = parkingLot.vehicles.indexOf(req.body.vehicleNumber);
        if(indexToAdd !== -1){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This vehicle is already parked in this Lot",
                "data": null
            });
        }
        
        const allParkingLot = await ParkingLot.find();
        
        let alreadyParked = false;
        allParkingLot.map((lot) => {
            if(lot.vehicles.includes(req.body.vehicleNumber)){
                alreadyParked = true;
                return;
            }
        });
        
        if(alreadyParked){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This Vehicle is already parked in some other lot",
                "data": null
            });
        }
        
        const numOfCurrCars = parkingLot.currHold;
        if(numOfCurrCars === parkingLot.capacity){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot is full",
                "data": null
            });
        }
        
        const enterDetails = new Vehicle({
            parkingLotID : lotID,
            vehicleNumber : req.body.vehicleNumber,
            vehicleType : req.body.vehicleType,
            enteredAt: new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'})
        });
        
        await Vehicle.create(enterDetails);
        parkingLot.currHold++;
        parkingLot.vehicles.push(req.body.vehicleNumber);
        await parkingLot.save();
        
        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully parked a new vehicle",
            "data": [enterDetails]
        });
    }
    catch(err){
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

const exitVehicle = async(req,res) => {
    try{
        const currHead = req.head;

        const lotID = req.body.parkingLotID;
        const parkingLot = await ParkingLot.findById({_id: lotID});
        if(!parkingLot){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot does not exist",
                "data": null
            });
        }

        let isHead = false;
        if(currHead.assignedParkingLot.includes(lotID))
        isHead = true;

        if(!isHead){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This parking lot is not assigned to you",
                "data": null
            });
        }

        if(req.body.vehicleType.toLowerCase() !== "car" && req.body.vehicleType.toLowerCase() !== "bike"){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot has only bike and car",
                "data": null
            });
        }

        const currVehicle = await Vehicle.findOne({vehicleNumber: req.body.vehicleNumber});
        if(!currVehicle){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This vehicle does not exist",
                "data": null
            });
        }

        if(currVehicle.vehicleType !== req.body.vehicleType.toLowerCase()){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This vehicle type is wrong",
                "data": null
            });
        }

        const indexToRemove = parkingLot.vehicles.indexOf(req.body.vehicleNumber);
        if(indexToRemove === -1){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This vehicle is not parked in this Lot",
                "data": null
            });
        }

        const exitTime = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});

        const exitDate = new Date(exitTime);
        const enterDate = new Date(currVehicle.enteredAt);
        const timeDifference = exitDate - enterDate;

        const totalTimeParked = (timeDifference / (1000 * 60 * 60));

        let totalSumMoney;
        if(totalTimeParked < 1){
            if(req.body.vehicleType === "car"){
                totalSumMoney = parkingLot.hourlyRate.car;
            }
            else{
                totalSumMoney = parkingLot.hourlyRate.bike;
            }
        }

        else{
            if(req.body.vehicleType === "car"){
                totalSumMoney = totalTimeParked * parkingLot.hourlyRate.car;
            }
            else{
                totalSumMoney = totalTimeParked * parkingLot.hourlyRate.bike;
            }
        }

        const exitDetails = new Vehicle({
            parkingLotID : lotID,
            vehicleNumber : req.body.vehicleNumber,
            vehicleType : req.body.vehicleType,
            enteredAt: currVehicle.enteredAt,
            exitedAt: exitTime,
            totalTime: totalTimeParked*60,
            totalSum: totalSumMoney
        });

        parkingLot.totalMoney += totalSumMoney;
        parkingLot.vehicles.splice(indexToRemove, 1);
        parkingLot.currHold--;
        await parkingLot.save();

        await Vehicle.deleteOne(currVehicle);

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully exited a new vehicle",
            "data": [exitDetails]
        }); 
    }

    catch(err){
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

const allLots = async(req,res) => {
    try {
        const currHead = req.head;

        const allLotsOfHead = currHead.assignedParkingLot;

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully all lots",
            "data": allLotsOfHead
        });
    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};


const singleLot = async(req,res) => {
    try {
        const currHead = req.head;

        const allLotsOfHead = await currHead.assignedParkingLot;

        const lotID = req.params.id;

        const index = allLotsOfHead.indexOf(lotID);
        if(index === -1){
            return res.status(400).send({
                "success": true,
                "error_code": null,
                "message": "This Lot is not assigned to you",
                "data": null
            });
        }

        const singleLot = await ParkingLot.findById(lotID);
        if(!singleLot){
            return res.status(400).send({
                "success": true,
                "error_code": null,
                "message": "This Lot does not exist",
                "data": null
            });
        }

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched the lot",
            "data": [singleLot]
        });
    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
}


const allLotMoney = async(req,res) => {
    try {
        const currHead = req.head;

        const allLotsOfHead = await currHead.assignedParkingLot;
        if(allLotsOfHead.length === 0){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "You do not have any lot assigned",
                "data": null
            });
        }

        var moneyGathered = 0;
        await Promise.all(allLotsOfHead.map(async (lotID) => {
            const singleLot = await ParkingLot.findById(lotID);
            moneyGathered = moneyGathered + singleLot.totalMoney;
            
        }));
        
        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched the lot",
            "data": moneyGathered
        });
    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
}

module.exports = {
    loginHead,
    logoutHead,
    enterVehicle,
    exitVehicle,
    allLots,
    singleLot,
    allLotMoney
}