const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

app.get('/liveStream', function(req,res){
   res.render('liveStream');
});

app.get('/quiz', function(req,res){
  res.render('quiz');
});

const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log("Listening");
});
