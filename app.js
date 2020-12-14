const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const app = express();
app.use(express.json());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

// app.use(session({
//   name : 'abcabc',
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie : {
//     maxAge:(1000 * 60 * 100)
//   } 
// }));

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

//run mongod command in terminal in order to connect it to database.
// mongoose.connect("mongodb://localhost:27017/authDB", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route("/")
  .get((req, res) => {
    res.render("home");
  });


app.route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/dashboard");

        })
      }
    })
  });
  
app.route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register({ username: req.body.username, name: req.body.name }, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      }
      else {
        passport.authenticate("local")(req, res, () => {
        res.currentUser = user;
        res.redirect("/dashboard");

        })
      }
    })
  });

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  }
  else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})
app.route("/changePass")
  .get((req, res) => {
    res.render("changePass");
  })
  .post((req, res) => {
    if (req.isAuthenticated()) {
      User.findById(req.user._id)
        // I assume you already have authentication and the req.user is generated
        .then(foundUser => {
          foundUser.changePassword(req.body.old, req.body.new)
            .then(() => {
              console.log('Password changed');
              res.redirect("/");
            })
            .catch((error) => {
              console.log(error);
            })
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      res.redirect("/");
    }
  });



app.get('/liveStream', function(req,res){
  if (req.isAuthenticated()) {
    res.render('liveStream');
  }
  else{
    res.redirect("/");
  }
});

app.get('/quiz', function(req,res){
  if (req.isAuthenticated()) {
  res.render('quiz');
  }
  else{
    res.redirect("/");
  }
});

const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log("Listening");
});
