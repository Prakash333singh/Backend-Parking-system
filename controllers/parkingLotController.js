const ParkingLot = require("../models/parkingLots");

const createNewParkingLot = async(req,res) => {
    let lotLocation = await ParkingLot.findOne({location: req.body.location});
    if(lotLocation){
        return res.send({
            "success": false,
            "error_code": 404,
            "message": "Parking Lot already exists for this location",
            "data": null
        });
    }
    lotLocation = req.body.location;

    const lotCapacity = req.body.capacity;
    if(lotCapacity < 5){
        return res.send({
            "success": false,
            "error_code": 404,
            "message": "Parking Lot should have a minimum capacity of 5",
            "data": null
        });
    }

    const lotCurrHold = req.body.currHold;
    if(lotCurrHold && lotCurrHold !== 0){
        return res.send({
            "success": false,
            "error_code": 404,
            "message": "Intial curr holding should be 0",
            "data": null
        });
    }

    const newVehicles = req.body.vehicles;
    if(newVehicles && newVehicles.length > 0){
        return res.send({
            "success": false,
            "error_code": 404,
            "message": "Cannot add new vehicles via this route",
            "data": null
        });
    }

    if(req.body.hourlyRate){
        var lotHourlyRateCar = req.body.hourlyRate.car;
        if(lotHourlyRateCar && (lotHourlyRateCar > 100 || lotHourlyRateCar < 10)){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Parking Lot rates for car should be between 10 to 100",
                "data": null
            });
        }

        var lotHourlyRateBike = req.body.hourlyRate.bike;
        if(lotHourlyRateBike && (lotHourlyRateBike > 70 || lotHourlyRateBike < 10)){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Parking Lot rates for bike should be between 10 to 100",
                "data": null
            });
        }
    }

    const lotTotalMoney = req.body.totalMoney;
    if(lotTotalMoney && lotTotalMoney !== 0){
        return res.send({
            "success": false,
            "error_code": 404,
            "message": "Parking Lot money gathered should be 0 intially ",
            "data": null
        });
    }
    
    const newParkingLot = new ParkingLot({
        name: req.body.name,
        location: lotLocation,
        capacity: lotCapacity,
        hourlyRate: {
            car: lotHourlyRateCar,
            bike: lotHourlyRateBike
        }
    });

    try{
        await ParkingLot.create(newParkingLot);

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully created new parking lot",
            "data": [newParkingLot]
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


const fetchAllParkingLots = async(req,res) => {
    try{
        const allParkingLots = await ParkingLot.find();

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched all parking lots",
            "data": allParkingLots
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


const fetchSingleParkingLot = async(req,res) => {
    const lotID = req.params.id;

    try{
        const singleParkingLot = await ParkingLot.findById(lotID);
        if(!singleParkingLot){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Parking Lot does not exist",
                "data": null
            });
        }

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched the parking lot",
            "data": [singleParkingLot]
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


const updateSingleParkingLot = async(req,res) => {
    const lotID = req.params.id;

    try{
        const updatedParkingLot = await ParkingLot.findById(lotID);
        if(!updatedParkingLot){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Parking Lot does not exist",
                "data": null
            });
        }

        var lotName = req.body.name;
        var lotLocation = req.body.location;

        if(!lotName)
            lotName = updatedParkingLot.name;

        if(!lotLocation)
            lotLocation = updatedParkingLot.location;

        if(lotName !== updatedParkingLot.name || lotLocation !== updatedParkingLot.location){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Cannot update name or location of Parking Lot",
                "data": null
            });
        }

        var lotCapacity = req.body.capacity;

        if(!lotCapacity)
            lotCapacity = updatedParkingLot.capacity;

        if(lotCapacity < updatedParkingLot.capacity){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Parking Lot capacity cannot be reduced",
                "data": null
            });
        }

        const lotCurrHold = req.body.currHold;
        if(lotCurrHold && lotCurrHold !== updatedParkingLot.currHold){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Cannot update curr holding of vehicles in a lot",
                "data": null
            });
        }

        const newVehicles = req.body.vehicles;
        if(newVehicles && newVehicles.length > 0){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Cannot add new vehicles via this route",
                "data": null
            });
        }

        if(req.body.hourlyRate){
            var lotHourlyRateCar = req.body.hourlyRate.car;
            if(lotHourlyRateCar && (lotHourlyRateCar > 100 || lotHourlyRateCar < 10)){
                return res.send({
                    "success": false,
                    "error_code": 404,
                    "message": "Parking Lot rates for car should be between 10 to 100",
                    "data": null
                });
            }

            var lotHourlyRateBike = req.body.hourlyRate.bike;
            if(lotHourlyRateBike && (lotHourlyRateBike > 70 || lotHourlyRateBike < 10)){
                return res.send({
                    "success": false,
                    "error_code": 404,
                    "message": "Parking Lot rates for bike should be between 10 to 100",
                    "data": null
                });
            }
        }

        const lotTotalMoney = req.body.totalMoney;
        if(lotTotalMoney && lotTotalMoney !== updatedParkingLot.totalMoney){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Parking Lot money gathered cannot be updated",
                "data": null
            });
        }

        updatedParkingLot.name = lotName;
        updatedParkingLot.location = lotLocation;
        updatedParkingLot.capacity = lotCapacity;
        updatedParkingLot.hourlyRate.car = lotHourlyRateCar;
        updatedParkingLot.hourlyRate.bike = lotHourlyRateBike;

        await updatedParkingLot.save();

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully updated the parking lot",
            "data": [updatedParkingLot]
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


const deleteSingleParkingLot = async(req,res) => {
    const lotID = req.params.id;

    try{
        const deletedParkingLot = await ParkingLot.findById(lotID);
        if(!deletedParkingLot){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Parking Lot does not exist",
                "data": null
            });
        }

        await deletedParkingLot.deleteOne();

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully deleted the parking lot",
            "data": null
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

const totalMoney = async(req,res) => {
    try {
        const allLots = await ParkingLot.find();

        if(allLots.length === 0){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Parking Lots not created yet",
                "data": null
            });
        }

        let moneyGathered = 0;
        allLots.map((lot) => {
            moneyGathered += lot.totalMoney;
        });

        return res.status(200).send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched total money gathered till now",
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
};

module.exports = {
    createNewParkingLot,
    fetchAllParkingLots,
    fetchSingleParkingLot,
    updateSingleParkingLot,
    deleteSingleParkingLot,
    totalMoney
} 