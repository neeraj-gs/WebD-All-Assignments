const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');


app.use(express.json());
app.use(bodyParser.json())

let ADMINS = [];
let USERS = [];
let COURSES = [];


var SECRET_KEY = "MySecretKey"

const generateJwt = (user)=>{
  const payload = {username:user.username}
  return jwt.sign(payload , SECRET_KEY ,{expiresIn:'1h'})
}

const authenticateJwt = (req,res,next)=>{
  const authorization = req.headers.authorization;
  if(authorization){
    const token = authorization.split(' ')[1];

    jwt.verify(token,SECRET_KEY,(err,user)=>{
      if(err){
        res.status(404)
      }
      req.user = user;
      next();
    })
  }
  else{
    res.status(401)
  }

}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existing = ADMINS.find(e=>e.username === admin.username)
  if(existing){
    res.status(404).send(`Admin already Exists`)
  }
  else{
    ADMINS.push(admin);
    const token = generateJwt(admin);
    res.status(200).json({message:`Admin Created Successfully`,token})

  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username , password} = req.headers;
  const admin = ADMINS.find(a=>a.username === username && a.password===password)

  if(admin){
    var token = generateJwt(admin)
    res.status(200).json({
      message:`Loggin In Successfully`,token
    })
  }
  else{
    res.json({message:`Authorization Failed`})
  }
});

app.post('/admin/courses', authenticateJwt ,(req, res) => {
  // logic to create a course
  const course = require.body;
  var id=COURSES.length+1;
  COURSES.push(course)
  res.json({mesage:`Course Created Successfully`,courseId:id})
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(port, () => {
  console.log('Server is listening on port 3000');
});
