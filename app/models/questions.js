const mongoose = require('mongoose');

const quesSchema = new mongoose.Schema({
    question : String,
    choices: [String],
    correctAnswer: Number
});

module.exports = mongoose.model('Question', quesSchema);
