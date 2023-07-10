const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];


// Admin routes
//Admin authentication middleware that is passed in header everytime a admin logins
const adminAuthentication = (req, res, next) => { //middleware for authentication of admin
  const { username, password } = req.headers;

  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};

//admin sign up
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    res.json({ message: 'Admin created successfully' });
  }
});

//admin login
app.post('/admin/login', adminAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});


app.post('/admin/courses',adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now(); //using timestamps for id
  COURSES.push(course);
  res.json(
    { message: 'Course created successfully', 
    courseId: course.id })
});

app.put('/admin/courses/:courseId',adminAuthentication , (req, res) => {
  // logic to edit a course
  var course = COURSES.find(c=>c.id === parseInt(req.params.courseId))
  if(course){
    Object.assign(course,req.body);
    res.json({ message: 'Course updated successfully' })
  }else{
    res.status(404).send('Course Not Found')
  }

});

app.get('/admin/courses', adminAuthentication , (req, res) => {
  // logic to get all courses
  res.send(COURSES)
});



const userAuthentication = (req,res,next)=>{
  const {username , password} = req.headers;

  const user = USERS.find(u => u.username === username && u.password === password)
  if(user){
    next()
  }else{
    res.status(403).json({message:`User Authentication Failed`})
  }
}


// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var user = {
    username:req.body.username,
    password:req.body.password
  }
  var u = USERS.find(us => us.username === user.username && us.password===user.password)
  if(u){
    res.json({message:`User Already Exists`})
  }
  else{
    USERS.push(user);
    res.json({message:`User Created Successfully`})
  }
});

app.post('/users/login',userAuthentication, (req, res) => {
  // logic to log in user
  res.json({mesage:`Login Successfuly by User`})
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

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
