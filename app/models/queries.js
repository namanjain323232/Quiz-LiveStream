const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const strSchema = new mongoose.Schema({
   name: String,
   query: String
});

module.exports = mongoose.model("Query", strSchema);
