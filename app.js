const dotenv = require('dotenv');
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
const cookieSession = require("cookie-session");

// var fs = require('fs');
// var multer = require('multer');

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// });

// var upload = multer({ storage: storage });
// app.use(multer({
//   dest: './uploads/',
//   rename: function (fieldname, filename) {
//     return filename;
//   },
// }));
app.use(express.json());

app.use(cookieParser(process.env.SECRET));
app.use(cookieSession({
  name: 'session',
  keys: ['x', 'y'],
  secret: process.env.SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
   "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected !");
  });
// const http=require("http");
// const configDB = require('./config/database.js');

// configuration ===============================================================
// mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true }); // connect to our database
// mongoose.set("useCreateIndex", true);
require('./config/passport')(passport); // pass passport for configuration
// set up our express application
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({limit: '50mb'})); // get information from html forms
app.use(bodyParser.raw({limit: '50mb', type: 'multipart/form-data'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// launch ======================================================================
app.listen(port, () => {
   console.log("Listening to", port);
 });