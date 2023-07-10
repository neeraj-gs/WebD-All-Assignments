const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(express.json());
app.use(bodyParser.json())

let ADMINS = [];
let USERS = [];
let COURSES = [];
//any change we make to USERS array it will cah ge as global users object
//we are storing a user as a refrence to req.users so taht we can use it later
//cahnge is actually done here


const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};




/*
NOTE
If a matching user is found, the code assigns the user object to the req.user property. This is done to attach the user object to the request object so that it can be accessed by subsequent middleware functions or route handlers:
javascript
req.user = user;
By assigning the user object to req.user, it becomes available throughout the request-response cycle and can be accessed and utilized by other middleware or route handlers.




To summarize, the line req.user = user; assigns the user object to the req.user property, making it available for further processing in subsequent middleware or route handlers.
*/
const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    req.user = user;  // Add user object to the request
    //we stored in the request object something
    //req first goe sto middelware and tehn to handler , middleware can change them also
    //once the next() is called we can log req.user 
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
};

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

app.post('/admin/login', adminAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
}); //ligin just ahs to make sure if username adn password is correct ornot , from the header


app.post('/admin/courses', adminAuthentication, (req, res) => {
  const course = req.body;
  //here we have ot do validations when some wrong body is sent
  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    Object.assign(course, req.body); //or lese for each we have to remove and add varialve 
    //It replaces course in memory and no need to delete and add a new instance , it will update
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});

app.post('/users/signup', (req, res) => {
  // const user = {...req.body, purchasedCourses: []}; //gets all the inouts from body 
  //this is alled as specific type of syntax as below , 
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: [] //as the user buys the course , we will popilate it
  }
  USERS.push(user); //we cna ahve an account as admin and user but not 2 same 
  res.json({ message: 'User created successfully' });
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // COURSES.filter(c => c.published)
  //filter is a fuction that will take wach iter in arary and compare with otehr
  //based on rhs aray gets filtered
  let filteredCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    } //use should see only published coureses

  }
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  //makes the user purchase it
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) { //we are pushing course id and purchased courses ahs only the id's so we ned to popualte entire object
    req.user.purchasedCourses.push(courseId); //store courses user has purachased
    //req.user gives the specific user
    //if auth is passed handler is reached
    //var username = req.headers["username"]
    //we steore req.users in the middleware and push it to the ein memory objects

    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  // We need to extract the complete course object from COURSES
  // which have ids which are present in req.user.purchasedCourses
  //req,users.purchasedcOURSES has a bunch of these courses where purchased course 
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4]; //1,4 is the puracjes courses say
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) { //from global courses find the ourse with taht id 1,4 , gives -1 if that ele is not present in array
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) { //index of tells the index of an item in the array
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
