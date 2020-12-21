const User = require('../app/models/user');
const admin = require('../app/models/admin');
//const Ques=require('../app/models/questions');
const {Ques,Quiz} = require('../app/models/Quiz');
const Notification=require('../app/models/notification');
const Announce = require('./models/announcement');
const Stream = require('./models/stream');
const Queries = require('./models/queries');
const Result = require('./models/results');
const Image = require('../app/models/answerKey');
const { Query } = require('mongoose');
const getAdmin=admin();

module.exports = function (app, passport) {

let ques=[];

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
    User.register({ username: req.body.username, name: req.body.name, phone: req.body.phone, education: req.body.education, address: req.body.address }, req.body.password, (err, user) => {
      if (err) {
        console.log(err.message);
        res.redirect("/register");
      }
      else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/dashboard");

        })
      }
    })
  });

app.get("/dashboard", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.username == getAdmin.username) {
       res.redirect("/admin");
    }
    else{
      const notifications = await Notification.find();
      const announce = await Announce.find();
      res.render('myBuys', { details: req.user, messages: notifications, ann: announce });
    }
  }
  else {
    res.redirect("/login");
  }
});

app.route("/userEdit").get((req, res) => {
  if (req.isAuthenticated()) {
      res.render("editUser", { details: req.user });
  }
  else {
    res.redirect("/login");
  }
}).post( async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {$set: {
    username: req.body.username,
    name: req.body.name,
    phone: req.body.phone
  }});

  res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})
app.route("/changePass")
  .get((req, res) => {
    res.render("changePass", { details: req.user });
  })
  .post((req, res) => {
    if (req.isAuthenticated()) {
      User.findById(req.user._id)
        // I assume you already have authentication and the req.user is generated
        .then(foundUser => {
          foundUser.changePassword(req.body.old, req.body.new)
            .then(() => {
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



app.get('/liveStream', async function(req,res){
  if (req.isAuthenticated()) {
    const stream = await Stream.find();
    console.log(stream);
    res.render('liveStream', { stream });
  }
  else{
    res.redirect("/");
  }
});
app.get('/aboutApp', async function(req,res){
  if (req.isAuthenticated()) {
    res.render('aboutApp', { details: req.user });
  }
  else{
    res.redirect("/");
  }
});

app.route("/deskHelp").get((req,res) => {
  if (req.isAuthenticated()) {
    res.render('deskHelp', { details: req.user });
  }
  else{
    res.redirect("/");
  }
}).post( async (req, res) => {
  await Queries.create({
    name: req.body.name,
    query: req.body.query
  });

  res.redirect("/dashboard");
});

// app.get('/shareApp', async function(req,res){
//   if (req.isAuthenticated()) {
//     res.render('shareApp', { details: req.user });
//   }
//   else{
//     res.redirect("/");
//   }
// });

app.get('/results', async function(req,res){
  if (req.isAuthenticated()) {
    res.render('results', { details: req.user });
  }
  else{
    res.redirect("/");
  }
});

app.route("/stream").post( async (req, res) => {
  await Stream.create({
    url: req.body.stream
  }
  );
});

app.get('/quiz/:quizId', async function(req,res){
  if (req.isAuthenticated()) {
  const quiz = await Quiz.findById(req.params.quizId);
  res.render('quiz', { details: req.user, quizDetails: quiz });
  }
  else{
    res.redirect("/");
  }
});

app.post('/quiz', async (req, res) => {
  await Result.create({
    name: req.user._id,
    quizId: req.body.quizId,
    quiz: req.body.quizName,
    course: req.body.course,
    marks: req.body.marks,
    max: req.body.max,
    correct: req.body.correct,
    incorrect: req.body.incorrect,
    notAttempted: req.body.notAttempted,
    time: req.body.time
  });
});

app.get('/courses', function(req,res){
  if (req.isAuthenticated()) {
  res.render('showCourse', { details: req.user });
  }
  else{
    res.redirect("/");
  }
});

app.get('/mybuys', async function(req,res){
  if (req.isAuthenticated()) {
    const notifications = await Notification.find();
    const announce = await Announce.find();
    res.render('myBuys', { details: req.user, messages: notifications, ann: announce });
  }
  else{
    res.redirect("/");
  }
});

app.get('/viewQueries', async function(req,res){
  if (req.isAuthenticated()) {
    const queries = await Queries.find();
    res.render('viewQueries', { details: req.user, ann: queries });
  }
  else{
    res.redirect("/");
  }
});

app.get('/notification', async function(req,res){
  if (req.isAuthenticated()) {
  const notifications = await Notification.find();
  res.render('notification', { details: req.user, messaging: notifications });
  }
  else{
    res.redirect("/", { details: req.user });
  }
});

app.get('/quizlist/:subject', async function(req,res){
  if (req.isAuthenticated()) {
  const quizzes = await Quiz.find({ courseName: req.params.subject });
  res.render('quizList', { details: req.user, quizList: quizzes }); 
  }
  else{
    res.redirect("/");
  }
});

app.get('/details', function(req,res){
  if (req.isAuthenticated()) {
  res.render('dashboard', { details: req.user }); 
  }
  else{
    res.redirect("/");
  }
});

app.get('/Newlivestream', function(req,res){
  if (req.isAuthenticated()) {
  res.render('Newlivestream'); 
  }
  else{
    res.redirect("/");
  }
});

  app.route('/admin')
    .get((req, res) => {
      if (req.isAuthenticated()) {
        if (req.user.username == getAdmin.username) {
          res.render("adminDashboard", { details: req.user });
        }
        else {
          res.render("dashboard", { details: req.user });
        }
      }
      else {
        res.redirect("/login");
      }
    });
    let quizName="";
    let courseName="";
    app.route("/createQuiz")
      .get((req,res)=>{
        if (req.isAuthenticated()) {
          if (req.user.username == getAdmin.username) {
            res.render("createQuiz", { details: req.user });
          }
          else {
            res.render("dashboard", { details: req.user });
          }
      }
      else{
        res.redirect("/login");
      }
    })
    .post((req,res)=>{
        quizName=req.body.quizName;
        courseName=req.body.courseName;
        res.redirect("/addQues");
    });

    app.route("/addQues")
        .get((req,res)=>{
          if (req.isAuthenticated()) {
            if (req.user.username == getAdmin.username) {
              res.render("addQues",{
                quizName: quizName,
                details: req.user
              });
            }
            else {
              res.render("dashboard", { details: req.user });
            }
          }
          else {
            res.redirect("/login");
          }
        })
        .post((req,res)=>{
            // let question=req.body.question;
            // let op1=req.body.op1;
            // let op2=req.body.op2;
            // let op3=req.body.op3;
            // let op4=req.body.op4;
            // let answer=req.body.answer-1;
            let quest=new Ques({
              question:req.body.question,
              choices: [req.body.op1, req.body.op2, req.body.op3, req.body.op4],
              correctAnswer: req.body.answer-1
            });
            quest.save();
            ques.push(quest);
            res.redirect("/addQues");

        });
        
  app.get("/testCreated",(req,res)=>{
    if (req.isAuthenticated()) {
      if (req.user.username == getAdmin.username) {
        res.render("testCreated", { details: req.user });
        let addQuiz=new Quiz({
          courseName:courseName,
          quizName:quizName,
          questions:ques
        });
        addQuiz.save();
        ques=[];

      }
      else {
        res.render("dashboard", { details: req.user });
      }
    }
    else {
      res.redirect("/login");
    }
  });

  app.route("/showQuiz")
     .get((req,res)=>{
       if (req.isAuthenticated()) {
         if (req.user.username == getAdmin.username) {
           res.render("showQuiz", { details: req.user });
         }
         else {
           res.render("dashboard", { details: req.user });
         }
       }
       else {
         res.redirect("/login");
       }
     })

     .post((req,res)=>{
      //let courseName=req.body.courseName;
       Quiz.find({courseName:req.body.courseName},(err, quizzes) => {
         if (err)
           console.log(err);
           else {
                res.render("showQuiz2", {
                courseQuiz: quizzes,
                details: req.user
              });
         }
        });
    });


    app.route("/createNotification")
      .get((req, res) => {
        if (req.isAuthenticated()) {
          if (req.user.username == getAdmin.username) {
            res.render("createNotification", { details: req.user });
          }
          else {
            res.render("dashboard", { details: req.user });
          }
        }
        else {
          res.redirect("/login");
        }
      })
      .post((req,res)=>{
        let notif=new Notification({
          notifTitle: req.body.notifTitle,
          notifBody: req.body.notifBody
        });
        notif.save();
        console.log(notif);
        res.redirect("/admin");
      });

      app.route("/createAnnouncement")
      .get((req, res) => {
        if (req.isAuthenticated()) {
          if (req.user.username == getAdmin.username) {
            res.render("createAnnouncement", { details: req.user });
          }
          else {
            res.render("dashboard", { details: req.user });
          }
        }
        else {
          res.redirect("/login");
        }
      })
      .post((req,res)=>{
        let notif=new Announce({
          text: req.body.notifTitle,
        });
        notif.save();
        res.redirect("/admin");
      });
    
    app.route("/showUsers")
      .get((req, res) => {
        if (req.isAuthenticated()) {
          if (req.user.username == getAdmin.username) {
            let arr = [];
            User.find(function (err, users) {
              if (err)
                console.log(err);
              else {
                User.findOne({ username: getAdmin.username }, (err, use) => {
                  if (err)
                    console.log(err);
                  else {
                    arr = users.filter(function (user) {
                          if (user.username != use.username)
                            return user
                        });
                    //console.log(arr);
                    res.render("showUsers", {
                      users: arr,
                      details: req.user
                    });
                  }
                });
              }
            });  
          }
          else {
            res.render("dashboard", { details: req.user });
          }
        }
        else {
          res.redirect("/login");
        }
      });  
    
    

  // app.get('/uploadAnswer', (req, res) => {
  //   if (req.isAuthenticated()) {
  //      if (req.user.username == getAdmin.username) {
  //      imgModel.find({}, (err, items) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //       else {
  //         res.render('uploadAnswer', { items: items });
  //       }
  //     });
  //   }
  //   else{
  //     res.render("dashboard");
  //   }
  // }
  //   else {
  //     res.redirect("/login");
  //   }


  // });
  
  // app.post('/uploadAnswer', upload.single('image'), (req, res, next) => {

  //   var obj = {
  //     name: req.body.name,
  //     desc: req.body.desc,
  //     img: {
  //       data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
  //       contentType: 'image/png'
  //     }
  //   }
  //   imgModel.create(obj, (err, item) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     else {
  //       // item.save();
  //       res.redirect('/admin');
  //     }
  //   });
  // });



};


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}