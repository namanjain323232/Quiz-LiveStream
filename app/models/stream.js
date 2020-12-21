const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
   url: String
});

module.exports = mongoose.model("Stream", streamSchema);
