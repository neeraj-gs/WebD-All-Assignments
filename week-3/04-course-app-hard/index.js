const express = require('express');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json())

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
const Course = mongoose.model('Course', courseSchema);


const SECRET = "SecretKey";

let ADMINS = [];
let USERS = [];
let COURSES = [];


mongoose.connect('mongodb+srv://neerajgs:Neeraj@123@cluster0.avedxvy.mongodb.net/')

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
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
