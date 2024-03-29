const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Hurray! Database connected");
    } catch(err){
        console.log(err);
    }
};

module.exports = connectDB;