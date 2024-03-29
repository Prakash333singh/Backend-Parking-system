const express = require("express");
const {adminAuthentication} = require("../middlewares/adminAuth");
const parkingLotController = require("../controllers/parkingLotController");

parkingLotRouter = express.Router();

parkingLotRouter.post("/", adminAuthentication, parkingLotController.createNewParkingLot);
parkingLotRouter.get("/", adminAuthentication, parkingLotController.fetchAllParkingLots);
parkingLotRouter.get("/totalMoney", adminAuthentication, parkingLotController.totalMoney);
parkingLotRouter.get("/:id", adminAuthentication, parkingLotController.fetchSingleParkingLot);
parkingLotRouter.patch("/:id", adminAuthentication, parkingLotController.updateSingleParkingLot);
parkingLotRouter.delete("/:id", adminAuthentication, parkingLotController.deleteSingleParkingLot);


module.exports = parkingLotRouter;