const express = require("express");
const {headAuthentication} = require("../middlewares/headAuth");
const headController = require("../controllers/headController");

headRouter = express.Router();

headRouter.post("/login", headController.loginHead);
headRouter.post("/logout", headAuthentication, headController.logoutHead);
headRouter.post("/enterVehicle", headAuthentication, headController.enterVehicle);
headRouter.post("/exitVehicle", headAuthentication, headController.exitVehicle);
headRouter.get("/allLots", headAuthentication, headController.allLots);
headRouter.get("/singleLot/:id", headAuthentication, headController.singleLot);
headRouter.get("/allLotMoney", headAuthentication, headController.allLotMoney);

module.exports = headRouter;