const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const payMoneySchema = new mongoose.Schema({
   paymentId: String,
   userId: String,
   id: String,
   course: String,
   amount: String,
   phone: String,
   fromDate: Date,
   toDate: Date,
   paymentStatus: String
});

payMoneySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Payment', payMoneySchema);