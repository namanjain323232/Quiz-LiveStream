const { Schema } = require("mongoose");
const mongoose=require("mongoose");

const notificaSchema=new mongoose.Schema({
        text: String
});

module.exports=mongoose.model("Announcement",notificaSchema);
