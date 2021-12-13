const express = require('express')
const app = express();                 // define our app using express
const bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'}
]

var port = process.env.PORT || 8080; 

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  res.set({
    'bacon': 10
});

  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/courses', function(req, res) {
  res.send(courses);
});

router.get('/courses/:id', function(req, res) {
  const course = courses.find(course => course.id === Number(req.params.id))
  if(!course){
    // 404
    res.status(404).send("course isn't available")
  }
  res.send(course);
});

router.post('/courses', function(req, res) {
  const course = {
    id: courses.length + 1,
    name: req.body.name
  }
  console.log(req, 'logging req')
  courses.push(course)
  res.send(course);
});

// update db base
router.put('/courses/:id', function(req, res) {
  const course = courses.find(course => course.id === Number(req.params.id))
  if(!course) res.status(404).send('course not there, cant update')
  course.name = req.body.name
  res.send(course);
});

router.delete('/courses/:id', function(req, res) {
  const course = courses.find(course => course.id === Number(req.params.id))
  if(!course) res.status(404).send('course not there, cant update')
  
  const index = courses.indexOf(course)
  courses.splice(index, 1);

  res.send(course);
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);