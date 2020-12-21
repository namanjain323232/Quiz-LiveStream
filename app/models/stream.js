const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
   url: String,
   time: Date,
   views: {
      type: Number,
      default: 0
   }
});

module.exports = mongoose.model("Stream", streamSchema);
