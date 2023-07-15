const express = require('express');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json())


const authenticateJwt = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token,SECRET,(err,user)=>{
      if(err){
        return res.status(404);
      }
      else{
        req.user = user;
        next();
      }
    })
  }
  else{
    res.sendStatus(401);
  }

}


// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: {type: String}, //can also just mention String , but for purchsed course type has to be used
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] //Simialr to foreign key as in sql
});

const adminSchema = new mongoose.Schema({
  username:String,
  password:String
})

const coursesSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
})

// Define mongoose models
const User = mongoose.model('User', userSchema); //Colelction name is nothgin but a table in sql
const Admin = mongoose.model('Admin', adminSchema); //schema defiens the columsn adn types of specific tables as in sql
const Course = mongoose.model('Course', coursesSchema);


const SECRET = "SecretKey";



mongoose.connect('mongodb+srv://neerajgs:Neeraj@123@cluster0.avedxvy.mongodb.net/Courses',{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "Courses" });


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var {username,password} = req.body;
  Admin.findOne({username}).then((admin)=>{
    if(admin){
      res.status(403).json({message:`Admin Already Exists`})
    }
    else{
      const newAdmin = new Admin({username,password});
      newAdmin.save();
      const token = jwt.sign({username,role:'admin'},SECRET,{expiresIn:'1h'})
      res.json({message:`Admin Created Successfully`,token})

    }

  })
  
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
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
