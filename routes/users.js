const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated, checkRole, ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {title: "Login"}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
router.get('/userData', ensureAuthenticated, checkRole('Admin'), async (req, res)=>{
    const results = await User.find({role: "User"});
    res.render('userData', {results: results});
})
// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


//Login
router.post('/login',
  passport.authenticate('local', {
    // successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  }), function(req, res, next){
      if(req.user.role === "Admin"){
        res.redirect('/dashboard-admin');
      }else{
        res.redirect('/dashboard');
      }
  });
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
//Delete a user by id
router.delete('/delete/:id', ensureAuthenticated, checkRole('Admin'), (req, res)=>{
  const id = req.params.id;
  console.log(id);
  User.deleteOne({_id: id}, (err, result)=>{
    if(err){
      console.log(err);
    }else{

      res.send("Success");
    }
  })
});
module.exports = router;
