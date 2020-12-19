const { Schema } = require("mongoose");
const mongoose=require("mongoose");

const notificationSchema=new mongoose.Schema({
        notifTitle:String,
        notifBody:String
});

module.exports=mongoose.model("Notification",notificationSchema);
