const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const jwt = require('jsonwebtoken')
const fs = require('fs');

app.use(express.json());
app.use(bodyParser.json());

const authenticateJwt = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token,SECRET_KEY,(err,user)=>{
      if(err){
        res.status(404);
      }
      req.user = user; //Stores authenticated user in the request object
      next();
    })
  }else{
    res.status(404);
  }

}

let ADMINS = [];
let USERS = [];
let COURSES = [];

var SECRET_KEY = "MySecretCode"


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var {username,password}= req.body;
  var exist = ADMINS.find(a=>a.username === username)
  if(exist){
    res.status(404).send({message:`Admin Already Exists`});
  }
  else{
    const admin = {username,password}
    ADMINS.push(admin);
    fs.writeFileSync("admins.json", JSON.stringify(ADMINS))
    const token = jwt.sign({username , role:'admin'},SECRET_KEY,{expiresIn:'1h'})
    res.status(200).json({message:`Admin Created Successfully`,token})

  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username,password} = req.headers;
  const ad = ADMINS.find(a=>a.username === username && a.password ===password)
  if(ad){
    const token = jwt.sign({username ,role:'admin'},SECRET_KEY,{expiresIn:'1h'})
    res.status(200).json({message:`Logged in Successfully`,token})
  }
});

app.post('/admin/courses', authenticateJwt,(req, res) => {
  // logic to create a course
  const course = req.body;
  course.id=COURSES.length +1;
  COURSES.push(course);
  fs.writeFileSync("courses.json",JSON.stringify(course));
  res.status(200).json({message:`Course Created Successfully`,courseID:course.if})
});

app.put('/admin/courses/:courseId', authenticateJwt , (req, res) => {
  // logic to edit a course
  const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
  if (course) {
    Object.assign(course, req.body);
    fs.writeFileSync('courses.json', JSON.stringify(COURSES));
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
  
});

app.get('/admin/courses', authenticateJwt , (req, res) => {
  // logic to get all courses
  fs.readFileSync("courses.json","utf-8",(err,data)=>{
    if(err) throw err;
    else{
      res.json({courses: COURSES})
    }
  })
  
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
