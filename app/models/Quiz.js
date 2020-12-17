const mongoose = require('mongoose');


const quesSchema = new mongoose.Schema({
    question: String,
    choices: [String],
    correctAnswer: Number
});

const quizSchema=new mongoose.Schema({
    courseName:String,
    quizName: String,
    questions:[quesSchema]
});
module.exports.Ques=mongoose.model('Question',quesSchema);
module.exports.Quiz = mongoose.model('Quiz', quizSchema);