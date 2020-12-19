const User = require('./user');
const dotenv = require('dotenv');
function getAdmin(){
 return{
     username:process.env.ADMIN_ID,
     password:process.env.ADMIN_PASSWORD
 }
}
 module.exports=getAdmin;