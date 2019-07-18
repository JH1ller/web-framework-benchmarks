var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var Post = require('../models/postModel');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.getAllPosts(function(err, posts){
    if(err) throw err;
    res.render('index', { posts: posts });
  })
  
});

/* GET new post */
router.get('/posts/new', ensureAuthenticated, function(req, res, next) {
  res.render('new_post');
});

/* POST new post */
router.post('/posts/new', function(req, res, next) {
  
  var newPost = new Post();
  newPost.title = req.body.title;
  newPost.content = req.body.content;
  newPost.author = req.user;
  newPost.creationDate = new Date();
  newPost.save();
  req.flash('success', 'Your post has been created!');
  res.location('/');
  res.redirect('/');

});


// User Profiles
router.get('/profiles/:username', function(req, res) {

  username = req.params.username;
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      res.render('profile', { username: username, error: 'not found' });
      return;
    }
    res.render('profile', { username: user.username, email: user.email, imgsrc: '../uploads/' + user.profileImage, title: user.username });
  });

  
});

router.get('/welcome', ensureAuthenticated, function(req, res, next) {
  res.render('welcome', { title: 'Welcome' });
});


// Benchmark tests:

// test only request routing fundamentals
router.get('/plaintext', (req, res) =>
    res.header('Content-Type', 'text/plain').send('Hello, World!'));


// test json serialization performance
router.get('/json', (req, res) => res.send({ message: 'Hello, World!' }));
  
// test single database query performance over ORM
router.get('/db', (req, res) => {
  Post.findOne().lean().exec(function(err, doc) {
    res.json({ id: doc._id, title: doc.title });
  });
});

// test database update performance
router.get('/update', (req, res) => {
  Post.findOne().exec(function(err, doc) {
    doc.title = 'Blog Post ' + getRandomInt(10000, 99999);
    doc.content = getRandomInt(10000, 99999);
    doc.save();
    res.header('Content-Type', 'text/plain').send('success');
  });
});

// test server side template engine performance
router.get('/template', (req, res) => {
  Post.getAllPosts(function(err, posts){
    res.render('index', { posts: posts });
  })
});

// test post request handling and form validation performance
router.post('/post', function(req, res, next) {

  // Form validator
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email field is not valid').isEmail();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check errors
  var errors = req.validationErrors();

  if(errors){
    res.status(404).send({ message: 'failure' });
  } else  {
    res.send({ message: 'success' });
  }

});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
