const User = require('./user');
const dotenv = require('dotenv');
function getAdmin(){
 return{
     username: 'admin@gmail.com',
     password: 'admin'
 }
}
 module.exports=getAdmin;