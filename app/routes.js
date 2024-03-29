const multer = require("multer");
const sharp = require("sharp");
const User = require('../app/models/user');
const admin = require('../app/models/admin');
//const Ques=require('../app/models/questions');
const {Ques,Quiz} = require('../app/models/Quiz');
const Notification=require('../app/models/notification');
const Announce = require('./models/announcement');
const Stream = require('./models/stream');
const Queries = require('./models/queries');
const Result = require('./models/results');
const linkSchedule = require('./models/linkSchedule');
const Image = require('../app/models/answerKey');
const { Query } = require('mongoose');
const notification = require("../app/models/notification");
const getAdmin=admin();
const router = require('express').Router()
const Insta = require('instamojo-nodejs');
const url = require('url');
const Payment = require('./../app/models/payment');
const jwt = require('jsonwebtoken');
const { session } = require("passport");


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
      password: req.body.password,
    
    });

    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      else {
        passport.authenticate("local")(req, res,async () => {
          if(req.user._id!==null){
          let u=await User.findByIdAndUpdate({_id:req.user._id},{$set:{veri:1}},{new:true})
          }
          if(req.user.veri==1){
            res.redirect('/login')
          }else{
          res.redirect('/dashboard')
          }
           
       
        })
      }
    })
});


app.get("/register", (req, res) => {
    res.render("register");
  });

app.post("/register/:string", async (req, res) => {
    const users = await User.find();
    var Id = `${users.length}`;
    if(users.length<10){
      Id = '0000' + Id;
    }else if(users.length<100){
      Id = '000' + Id;
    }else if(users.length<1000){
      Id = '00' + Id;
    }else if(users.length<10000){
      Id = '0' + Id;
    }
    // console.log(Id);

    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        // console.log("Not Error!");
        cb(null, true);
      } else {
        // console.log("Error!");
        cb(console.log("Error!"), false);
      }
    };

    const upload = multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    });

    upload.single('image');
    var things = req.params.string.split('alagalagkarkedekhomilegainformation');
    // console.log(things);

    req.body.image = `user-${Date.now()}.jpeg`;

    await sharp(req.body)
    .toFormat("jpeg")
    .jpeg({ quality: 10 })
    .toFile(`public/img/users/${req.body.image}`);

    // console.log(req.params);
    // console.log(req.body.buffer);
    User.register({ username: things[2], name: things[1], phone: things[5], education: things[3], address: things[4], id: `YE${Id}`, image: req.body.image }, things[6], (err, user) => {
      if (err) {
        console.log(err.message);
        res.redirect("/register");
      }
      else {
        res.redirect("/login");
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
       const userMax = await User.findOne({ id: notifications[notification.length - 1].notifTitle });
      const announce = await Announce.find();
      const linkDrive = await linkSchedule.find();
      var driveLink = linkDrive[linkDrive.length - 1].text;
      const payments = await Payment.find({ id: req.user.id, toDate: { $gte: Date.now() } });
      res.render('myBuys', { details: req.user, l: driveLink,messages:userMax,ann: announce, courses: payments });
    }
  }
  else {
    res.redirect("/login");
  }
});

app.route("/userEdit").get(async (req, res) => {
  if (req.isAuthenticated()) {
      const linkDrive = await linkSchedule.find();
      var driveLink = linkDrive[linkDrive.length - 1].text;
      res.render("editUser", { details: req.user, l: driveLink });
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

app.get("/logout",async (req, res) => {
 if(req.user._id!==null){
  let u=await User.findByIdAndUpdate({_id:req.user._id},{$set:{veri:0}},{new:true})
 }
 
  req.logout();
  
  res.redirect("/");
})
app.route("/changePass")
  .get(async (req, res) => {
    const linkDrive = await linkSchedule.find();
    var driveLink = linkDrive[linkDrive.length - 1].text;
    res.render("changePass", { details: req.user, l: driveLink });
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
    await Stream.findOneAndUpdate(
      { _id: stream[stream.length - 1]._id },
      { $inc: { views: 1 } }
    );
    res.render('liveStream', { stream });
  }
  else{
    res.redirect("/");
  }
});
app.get('/aboutApp', async function(req,res){
  if (req.isAuthenticated()) {
    const linkDrive = await linkSchedule.find();
    var driveLink = linkDrive[linkDrive.length - 1].text;
    res.render('aboutApp', { details: req.user, l: driveLink });
  }
  else{
    res.redirect("/");
  }
});

app.route("/deskHelp").get(async (req,res) => {
  if (req.isAuthenticated()) {
    const linkDrive = await linkSchedule.find();
    var driveLink = linkDrive[linkDrive.length - 1].text;
    res.render('deskHelp', { details: req.user, l: driveLink });
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

app.get('/shareApp', async function(req,res){
  if (req.isAuthenticated()) {
    const linkDrive = await linkSchedule.find();
    var driveLink = linkDrive[linkDrive.length - 1].text;
    res.render('shareApp', { details: req.user, l: driveLink });
  }
  else{
    res.redirect("/");
  }
});

app.get('/results', async function(req,res){
  if (req.isAuthenticated()) {
    const resultTable = await Result.find({ name: req.user._id });
    const linkDrive = await linkSchedule.find();
    var driveLink = linkDrive[linkDrive.length - 1].text;
    res.render('results', { details: req.user, l: driveLink, resultTable });
  }
  else{
    res.redirect("/");
  }
});

app.route("/stream").post( async (req, res) => {
  await Stream.create({
    url: req.body.stream,
    time: req.body.time
  }
  );
});

app.post("/deleteQuiz", async (req, res) => {
  await Quiz.findOneAndDelete({
    _id: req.body.quiz
  }
  );
  res.redirect('/showQuiz');
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

app.route('/createTestSchedule').get(async function(req,res){
  if (req.isAuthenticated()) {
  res.render('createTestSchedule', { details: req.user });
  }
  else{
    res.redirect("/");
  }
}).post(async (req, res) => {
  await linkSchedule.create({
    text: req.body.text
  });

  res.redirect("/admin");
});

app.get('/courses', async function(req,res){
  if (req.isAuthenticated()) {
  const linkDrive = await linkSchedule.find();
  var driveLink = linkDrive[linkDrive.length - 1].text;
  res.render('showCourse', { details: req.user, l: driveLink });
  }
  else{
    res.redirect("/");
  }
});
var purchaseModel = {};
app.post('/course', async (req,res)=>{
  try {
    Insta.setKeys('143f421fa0f8be4cd41a2c843c8b1e1d', '827c9c4e0a1f63fe8696dd4e3c1caf66');
    purchaseModel = req.body;
    console.log(purchaseModel);
    const data = new Insta.PaymentData();
    
    data.purpose =  req.body.purpose;
    data.amount = req.body.amount;
    data.buyer_name =  req.body.buyer_name;
    data.email =  req.body.email;
    data.redirect_url =  req.body.redirect_url;
    data.phone =  req.body.phone;
    // data.user_id=req.body.user_id
    data.send_email =  false;
    data.webhook= 'http://www.example.com/webhook/';
    data.send_sms= false;
    data.allow_repeated_payments =  false;

    Insta.createPayment(data, function(error, response) {
        if (error) {
            console.error(error.message)
        } else {
          // Payment redirection link at response.payment_request.longurl
              const responseData = JSON.parse(response );
              // console.log(responseData);
             
             const redirectUrl = responseData.payment_request.longurl;
             if(redirectUrl){
               res.redirect(redirectUrl)
             }
             
        }
      });
} catch (error) {
    res.status(500).send("Server Error")
}
});

app.get('/callback', async(req,res) => {
   let url_parts = url.parse(req.url,true);
   responseData = url_parts.query;

   if(responseData.payment_id){
        // let userId = responseData.user_id;
        let future = new Date();
        let futures = future.setDate(future.getDate() + 30);

        // const data={
        //  payment_id:responseData.payment_id,
        //  user_id:responseData.user_id,
        //  start_date:Date.now(),
        //  end_date:futures,
        //  payment_status:"Success"
        // };
        
        //  console.log(data);

        await Payment.create({
          paymentId: responseData.payment_id,
          userId: responseData.user_id,
          id: purchaseModel.user_id,
          course: purchaseModel.course,
          amount: purchaseModel.amount,
          phone: purchaseModel.phone,
          fromDate: Date.now(),
          toDate: futures,
          paymentStatus: "Success"
        });
        
       res.redirect('/courses')   
   }
 });

// app.get('/mybuys', async function(req,res){
//   if (req.isAuthenticated()) {
//     const notifications = await Notification.find();
//     const announce = await Announce.find();
//     const linkDrive = await linkSchedule.find();
//     var driveLink = linkDrive[linkDrive.length - 1].text;
//     const payments = await Payment.find({ id: req.user.id });
//     res.render('myBuys', { details: req.user, l: driveLink, messages: notifications, ann: announce, courses: payments });
//   }
//   else{
//     res.redirect("/");
//   }
// });

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
  const quizzes = await Quiz.find({ courseName: req.params.subject }).limit(10);
  const linkDrive = await linkSchedule.find();
  var driveLink = linkDrive[linkDrive.length - 1].text;
  res.render('quizList', { details: req.user, l: driveLink, quizList: quizzes }); 
  }
  else{
    res.redirect("/");
  }
});

app.get('/details', async function(req,res){
  if (req.isAuthenticated()) {
  const linkDrive = await linkSchedule.find();
  var driveLink = linkDrive[linkDrive.length - 1].text;
  res.render('dashboard', { details: req.user, l: driveLink }); 
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
app.get('/webcamLi', function(req,res){
  if (req.isAuthenticated()) {
  res.render('webcamLive'); 
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
    let questionImage = '';
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
            if(questionImage){
              req.body.question = questionImage;
            }
            let quest=new Ques({
              question:req.body.question,
              choices: [req.body.op1, req.body.op2, req.body.op3, req.body.op4],
              correctAnswer: req.body.answer-1
            });
            quest.save();
            questionImage = '';
            ques.push(quest);
            res.redirect("/addQues");

        });

      app.post('/questionsImage', async (req, res) => {
        console.log(req.body);
          const multerStorage = multer.memoryStorage();

          const multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith("image")) {
              // console.log("Not Error!");
              cb(null, true);
            } else {
              // console.log("Error!");
              cb(console.log("Error!"), false);
            }
          };

          const upload = multer({
            storage: multerStorage,
            fileFilter: multerFilter,
          });

          upload.single('image');

          req.body.image = `question-${Date.now()}.jpeg`;

          questionImage = req.body.image;

          await sharp(req.body)
          .toFormat("jpeg")
          .jpeg({ quality: 10 })
          .toFile(`public/img/questions/${req.body.image}`);
      });
  app.post('/option1Image',async(req,res)=>{
    const multerStorage = multer.memoryStorage();

          const multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith("image")) {
              // console.log("Not Error!");
              cb(null, true);
            } else {
              // console.log("Error!");
              cb(console.log("Error!"), false);
            }
          };

          const upload = multer({
            storage: multerStorage,
            fileFilter: multerFilter,
          });

          upload.single('image_op1');

          req.body.image = `question-${Date.now()}.jpeg`;

          questionImage = req.body.image;
          console.log(questionImage)
          await sharp(req.body)
          .toFormat("jpeg")
          .jpeg({ quality: 10 })
          .toFile(`public/img/option1/${req.body.image}`);
  })
  app.post('/option2Image',async(req,res)=>{
    const multerStorage = multer.memoryStorage();

          const multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith("image")) {
              // console.log("Not Error!");
              cb(null, true);
            } else {
              // console.log("Error!");
              cb(console.log("Error!"), false);
            }
          };

          const upload = multer({
            storage: multerStorage,
            fileFilter: multerFilter,
          });

          upload.single('image_op2');

          req.body.image = `question-${Date.now()}.jpeg`;

          questionImage = req.body.image;
          console.log(questionImage)
          await sharp(req.body)
          .toFormat("jpeg")
          .jpeg({ quality: 10 })
          .toFile(`public/img/option2/${req.body.image}`);
  })
  app.post('/option3Image',async(req,res)=>{
    const multerStorage = multer.memoryStorage();

          const multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith("image")) {
              // console.log("Not Error!");
              cb(null, true);
            } else {
              // console.log("Error!");
              cb(console.log("Error!"), false);
            }
          };

          const upload = multer({
            storage: multerStorage,
            fileFilter: multerFilter,
          });

          upload.single('image_op3');

          req.body.image = `question-${Date.now()}.jpeg`;

          questionImage = req.body.image;
          console.log(questionImage)
          await sharp(req.body)
          .toFormat("jpeg")
          .jpeg({ quality: 10 })
          .toFile(`public/img/option3/${req.body.image}`);
  })
  app.post('/option4Image',async(req,res)=>{
    const multerStorage = multer.memoryStorage();

          const multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith("image")) {
              // console.log("Not Error!");
              cb(null, true);
            } else {
              // console.log("Error!");
              cb(console.log("Error!"), false);
            }
          };

          const upload = multer({
            storage: multerStorage,
            fileFilter: multerFilter,
          });

          upload.single('image_op4');

          req.body.image = `question-${Date.now()}.jpeg`;

          questionImage = req.body.image;
          console.log(questionImage)
          await sharp(req.body)
          .toFormat("jpeg")
          .jpeg({ quality: 10 })
          .toFile(`public/img/option4/${req.body.image}`);
  })
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
     .get(async (req,res)=>{
       if (req.isAuthenticated()) {
         if (req.user.username == getAdmin.username) {
           res.render("showQuiz", { details: req.user });
         }
         else {
           const linkDrive = await linkSchedule.find();
           var driveLink = linkDrive[linkDrive.length - 1].text;
           res.render("dashboard", { details: req.user, l: driveLink });
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

      app.route("/resetPassword")
        .get((req,res)=>{
          res.render("resetPassword");
        })

        .post((req,res)=>{
          User.findOne({ username: req.user.username })
            .then((u) => {
              u.setPassword(req.body.newPassword, (err, u) => {
                if (err) return next(err);
                u.save();
                res.status(200).json({ message: 'password change successful' });
                res.redirect("/login");
              });

            })
        });

        



};


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}