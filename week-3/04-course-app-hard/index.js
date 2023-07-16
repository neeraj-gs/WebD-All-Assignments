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

app.post('/admin/login',async (req, res) => {
  // logic to log in admin
  var {username,password} = req.body;
  var admin = await Admin.findOne({username})
  if(admin){
    const token = jwt.sign({username,role:'admin'},SECRET,{expiresIn:'1h'})
    res.json({message:`Logged in Successfully`,token})
  }else{
    res.json({message:`Admin Does not Exist`})
  }

});

app.post('/admin/courses', authenticateJwt , async(req, res) => {
  // logic to create a course
  const course = new Course(req.body)
  await course.save()
  res.json({message:`Course Created Successfully`,courseId:course.id})
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true }); //it will find by Id and then replace with req.body and then the optoin new:true explicitly ensures that the updated details are returned to theresult
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt , async (req, res) => {
  // logic to get all courses
  const course = await Course.find({});  //it will returnt he entire table as there is no specific command or filter to find on
  res.json({course})
});



// User routes
app.post('/users/signup', async(req, res) => {
  // logic to sign up user
  const {username,password} = req.body;
  const user =await User.findOne({username})
  if(user){
    res.json({message:`User Already Exists`})
  }else{
    const newUser = new User({username,password})
    await newUser.save()
    const token = jwt.sign({username,role:'user'},SECRET,{expiresIn:'1h'})
    res.json({message:`User Created Successfully`,token})
  }
  
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
