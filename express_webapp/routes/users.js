var express = require('express');
var router = express.Router();
var multer = require('multer');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

var upload = multer({ storage: storage })

var User = require('../models/userModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid username or password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));

router.post('/register', upload.single('profileImage'), function(req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  if(req.file){
    console.log('Uploading File...');
    var profileImage = req.file.filename;
  } else {
    console.log('No File uploaded.');
    var profileImage = 'noimage.jpg';
  }

  // Form validator
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email field is not valid').isEmail();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


  // Check errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors
    });
  } else if(User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      console.log(user);
      if(!user){
        return false;
      } else {
        return true;
      }
  }) == true){
    req.flash('error', 'A user with this name already exists.');
  } else {
    var newUser = new User({
      username: username,
      email: email,
      password: password,
      profileImage: profileImage,
      creationDate: Date.now()
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registered and can login');


    res.location('/');
    res.redirect('/');
  }
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});



module.exports = router;
