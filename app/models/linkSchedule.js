const { Schema } = require("mongoose");
const mongoose=require("mongoose");

const notificSchema=new mongoose.Schema({
        text: String
});

module.exports=mongoose.model("LinkSchedule",notificSchema);
