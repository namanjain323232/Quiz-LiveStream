const User = require('../app/models/user');
const admin = require('../app/models/admin');
//const Ques=require('../app/models/questions');
const {Ques,Quiz} = require('../app/models/Quiz');
const Notification=require('../app/models/notification');
const Image = require('../app/models/answerKey');
const getAdmin=admin();

module.exports = function (app, passport) {

  let ques=[];

  

app.route("/")
  .get((req, res) => {
    res.render("home");
  });


app.route("/login")
  .get((req, res) => {
    res.render("newlogin");
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
    User.register({ username: req.body.remail, name: req.body.rname, phone: req.body.rphone }, req.body.rpassword, (err, user) => {
      if (err) {
        console.log(err.message);
        res.redirect("/register");
      }
      else {
        res.redirect("/register");
        passport.authenticate("local")(req, res, () => {
          res.redirect("/dashboard");

        })
      }
    })
  });

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.username == getAdmin.username) {
       res.redirect("/admin");
    }
    else{
      res.render("dashboard");
    }
  }
  else {
    res.redirect("/login");
  }
});

app.route("/userEdit").get((req, res) => {
  if (req.isAuthenticated()) {
      res.render("editUser", { details: req.user});
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
    res.render("changePass");
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

app.get('/courses', function(req,res){
  if (req.isAuthenticated()) {
  res.render('showCourse');
  }
  else{
    res.redirect("/");
  }
});

app.get('/mybuys', function(req,res){
  if (req.isAuthenticated()) {
  res.render('myBuys');
  }
  else{
    res.redirect("/");
  }
});

app.get('/notification', function(req,res){
  if (req.isAuthenticated()) {
  res.render('notification');
  }
  else{
    res.redirect("/");
  }
});

app.get('/quizlist', function(req,res){
  if (req.isAuthenticated()) {
  res.render('quizList'); 
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
          res.render("adminDashboard");
        }
        else {
          res.render("dashboard");
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
            res.render("createQuiz");
          }
          else {
            res.render("dashboard");
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
                quizName:quizName
              });
            }
            else {
              res.render("dashboard");
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
        res.render("testCreated");
        let addQuiz=new Quiz({
          courseName:courseName,
          quizName:quizName,
          questions:ques
        });
        addQuiz.save();
        ques=[];

      }
      else {
        res.render("dashboard");
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
           res.render("showQuiz");
         }
         else {
           res.render("dashboard");
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
                courseQuiz:quizzes
              });
         }
        });
    });


    app.route("/createNotification")
      .get((req, res) => {
        if (req.isAuthenticated()) {
          if (req.user.username == getAdmin.username) {
            res.render("createNotification");
          }
          else {
            res.render("dashboard");
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
                      users: arr
                    });
                  }
                });
              }
            });  
          }
          else {
            res.render("dashboard");
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