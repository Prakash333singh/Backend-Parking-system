const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/connectDB");
const adminRouter = require("./routes/adminRoutes");
const parkingLotRouter = require("./routes/parkingLotRoutes");
const headRouter = require("./routes/headRoutes");


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

connectDB();

app.use("/api/admin/lot-head", adminRouter);
app.use("/api/parking-lots", parkingLotRouter);
app.use("/api/head", headRouter);


// Home Route
app.get("/", (req,res) => {
    res.send({
        "success": true,
        "error_code": null,
        "message": "Server is Running",
        "about": "Designed a real life system design problem about how Parking Lot Systems Works. Server is Live 🎉"
    });
});

app.listen(9000 || process.env.PORT, ()=> {
    console.log("Server Started");
});