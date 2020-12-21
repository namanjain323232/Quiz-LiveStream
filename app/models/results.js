const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const rSchema = new mongoose.Schema({
   name: String,
   quizId: String,
   quiz: String,
   course: String,
   time: Date,
   marks: Number,
   max: Number,
   correct: Number,
   incorrect: Number,
   notAttempted: Number
});

module.exports = mongoose.model("Result", rSchema);
