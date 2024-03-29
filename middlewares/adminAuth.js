const dotenv = require("dotenv");
const parkingLotHead = require("../models/parkingLotHead");

dotenv.config();

const adminAuthentication = async(req,res,next) => {
    if(!req.body.adminEmail || !req.body.adminPassword){
        return res.send({
            "success": false,
            "error_code": 400,
            "message": "You need admin email and password for this operation",
            "data": null
        });
    }

    const currEmail = req.body.adminEmail.toLowerCase();
    const currPassword = req.body.adminPassword;

    try {
        const currUser = await parkingLotHead.findOne({email: currEmail});
        if(currUser){
            return res.send({
                "success": false,
                "error_code": 404,
                "message": "Unauthorized try, Only Admin can create Parking Lot Heads",
                "data": null
            });
        }

        if(currEmail !== process.env.ADMIN_EMAIL || currPassword !== process.env.ADMIN_PASSWORD){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Incorrect Admin Email or Password",
                "data": null
            });
        }

        next();

    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

module.exports = {adminAuthentication};