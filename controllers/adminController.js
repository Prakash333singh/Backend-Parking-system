const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const ParkingLotHead = require("../models/parkingLotHead");
const ParkingLot = require("../models/parkingLots");

dotenv.config();

const createLotHead = async(req,res) => {
    try {
        const currHeadEmail = req.body.headEmail.toLowerCase();
        const currHead = await ParkingLotHead.findOne({email: currHeadEmail});
        if(currHead || req.body.headEmail.toLowerCase() === process.env.ADMIN_EMAIL){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Email already in use",
                "data": null
            });
        }

        const currLot = req.body.toAssignLot;

        const doesExist = await ParkingLot.findById({_id: currLot})
        if(!doesExist){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking lot does not exist",
                "data": null
            });
        }

        const allParkingLotHeads = await ParkingLotHead.find();

        let alreadyAssignedLot = false;
        allParkingLotHeads.map((lotHead) => {
            if(lotHead.assignedParkingLot.includes(currLot)){
                alreadyAssignedLot = true;
                return;
            }
        });

        if(alreadyAssignedLot){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Another Head already assigned to this Lot",
                "data": null
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.headPassword, 10);

        const newHead = new ParkingLotHead({
            headName: req.body.headName,
            email: req.body.headEmail,
            password: hashedPassword,
            toAssignLot: currLot,
            assignedParkingLot: []
        });

        newHead.assignedParkingLot.push(currLot);

        await ParkingLotHead.create(newHead);
        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully created a new head",
            "data": [newHead]
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


const deleteLotHead = async(req,res) => {
    try {
        const currID = req.params.id;
        const currHead = await ParkingLotHead.findById({_id: currID});
        if(!currHead){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Head does not exist",
                "data": null
            });
        }

        await ParkingLotHead.deleteOne(currHead);

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully deleted a head",
            "data": null
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

const assignLot = async(req,res) => {
    try{
        const currID = req.params.id;
        const currHead = await ParkingLotHead.findById({_id: currID});

        if(!currHead){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Head does not exist",
                "data": null
            });
        }

        const toAssignNewLot = req.body.toAssignLot;
        const currNewLot = await ParkingLot.findById({_id: toAssignNewLot});

        if(!currNewLot){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot to be assigned does not exist",
                "data": null
            });
        }

        const indexToAdd = currHead.assignedParkingLot.indexOf(toAssignNewLot);
        if(indexToAdd !== -1){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "This Head is already assigned to this Lot",
                "data": null
            });
        }

        const allParkingLotHeads = await ParkingLotHead.find();

        let alreadyAssignedLot = false;
        allParkingLotHeads.map((lotHead) => {
            if(lotHead.assignedParkingLot.includes(toAssignNewLot)){
                alreadyAssignedLot = true;
                return;
            }
        });

        if(alreadyAssignedLot){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Another Head already assigned to this Lot",
                "data": null
            });
        }

        currHead.assignedParkingLot.push(toAssignNewLot);
        await currHead.save();
        
        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully assigned a new lot to this head",
            "data": [currHead]
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

const unAssignLot = async(req,res) => {
    try{
        const currID = req.params.id;
        const currHead = await ParkingLotHead.findById({_id: currID});

        if(!currHead){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Head does not exist",
                "data": null
            });
        }

        const toUnAssignLot = req.body.toUnAssignLot;
        const currNewLot = await ParkingLot.findById({_id: toUnAssignLot});

        if(!currNewLot){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot to be Unassigned does not exist",
                "data": null
            });
        }

        const indexToRemove = currHead.assignedParkingLot.indexOf(toUnAssignLot);

        if(indexToRemove === -1){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lot to be Unassigned is not assigned to this head",
                "data": null
            });
        }

        currHead.assignedParkingLot.splice(indexToRemove, 1);
        await currHead.save();
        
        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully Unassigned a lot to this head",
            "data": [currHead]
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

const fetchSingleHead = async(req,res) => {
    try{
        const currID = req.params.id;
        const currHead = await ParkingLotHead.findById({_id: currID});

        if(!currHead){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Head does not exist",
                "data": null
            });
        }
        
        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched a lot head",
            "data": [currHead]
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


const fetchAllHeads = async(req,res) => {
    try{
        const allHeads = await ParkingLotHead.find();
        
        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched all heads",
            "data": allHeads
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

module.exports = {
    createLotHead,
    deleteLotHead,
    unAssignLot,
    assignLot,
    fetchSingleHead,
    fetchAllHeads,
}