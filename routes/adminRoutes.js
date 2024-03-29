const express = require("express");
const {adminAuthentication} = require("../middlewares/adminAuth");
const adminController = require("../controllers/adminController");

adminRouter = express.Router();

adminRouter.post("/register", adminAuthentication, adminController.createLotHead);
adminRouter.get("/:id", adminAuthentication, adminController.fetchSingleHead);
adminRouter.get("/", adminAuthentication, adminController.fetchAllHeads);
adminRouter.delete("/:id", adminAuthentication, adminController.deleteLotHead);
adminRouter.patch("/:id/unAssignLot", adminAuthentication, adminController.unAssignLot);
adminRouter.patch("/:id/assignLot", adminAuthentication, adminController.assignLot);


module.exports = adminRouter;