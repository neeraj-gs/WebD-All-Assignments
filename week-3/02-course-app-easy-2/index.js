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

var id = 0;


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
  const course = req.body;
  course.id = COURSES.length + 1; 
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);

  const courseIndex = COURSES.findIndex(c => c.id === courseId);

  if (courseIndex > -1) {
    const updatedCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = updatedCourse;
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }

});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  res.send(COURSES)
});



// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  const us = USERS.find(u=>u.username === user.username)
  if(us){
    res.status(401).json({message:`User already Exits`})
  }
  else{
    var token = generateJwt(user);
    USERS.push(user);
    res.status(200).json({message:`User Creted Successfully`,token})
    
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateJwt(user);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses', authenticateJwt ,(req, res) => {
  // logic to list all courses
  res.json(COURSES)
});

app.post('/users/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    const user = USERS.find(u => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(port, () => {
  console.log('Server is listening on port 3000');
});
