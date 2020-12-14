require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");
const http=require("http");
const configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true }); // connect to our database
mongoose.set("useCreateIndex", true);
require('./config/passport')(passport); // pass passport for configuration
// set up our express application
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: false
 })); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// launch ======================================================================
app.listen(port, () => {
   console.log("Listening to ",port);
 });
