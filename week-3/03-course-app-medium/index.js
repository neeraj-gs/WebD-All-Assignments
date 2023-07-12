const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const jwt = require('jsonwebtoken')
const fs = require('fs');

app.use(express.json());
app.use(bodyParser.json());

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

app.post('/admin/courses', (req, res) => {
  // logic to create a course
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
