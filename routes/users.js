const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const Comment = require('../models/Comment');

const passport = require('passport');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated, checkRole, ensureAuthenticated } = require('../config/auth');
// const { errors } = require('puppeteer');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {title: "Login"}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {title: "Register"}));
router.get('/userData', ensureAuthenticated, checkRole('Admin'), async (req, res)=>{
    const results = await User.find({role: "User"});
    res.render('userData', {results: results, title: "User Data"});
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
      title: "Reggister",
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
          title: "Register",
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
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newUser.password, salt);
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
  }), function(req, res){
      if(req.user.role === "Admin"){
        res.redirect('/dashboard-admin');
      }else{
        res.redirect('/dashboard');
      }
  });
// Logout
router.get('/logout', (req, res) => {
  //This req.logout logs the user out using the passport js configuration we did
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//Change Password
router.post('/changePass', (req, res)=>{
  const { email, newpassword1, newpassword2 } = req.body;
  let errors = [];

  if (!email || !newpassword1 || !newpassword2) {
    errors.push({ msg: 'Please enter all fields' });
  }


  if (newpassword1.length < 6 || newpassword2.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if(newpassword1 !== newpassword2){
    errors.push({ msg: 'Both the passwords should be the same' });
  }
  if (errors.length > 0) {
    res.render('forgotPass', {
      title: "Forgot Password",
      errors,
      email,
      newpassword1,
      newpassword2
    });
  } else {
    User.findOne({ email: email }).then(user => {
            if(user){
            const salt = bcrypt.genSaltSync(10);
            const hashedPass = bcrypt.hashSync(newpassword1, salt);
                User.findOneAndUpdate({email: email}, {password: hashedPass}, {new: true}, (err, updated)=>{
                  if(err){
                    console.log(err);
                  }else{
                    // console.log(updated);
                    req.flash(
                      'success_msg',
                      'Password changed successfully'
                    );
                    res.redirect('/users/login');
         
                  }
                })
         }else{
          errors.push({msg: "No user with that email is found"})
          res.render('forgotPass', {
            title: "Forgot Password",
            errors,
            email,
            newpassword1,
            newpassword2
          });
         }
       })
      }
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

//Get details of one user by id
router.get('/displayUser/:id', (req, res)=>{
  const id = req.params.id;
  User.findOne({_id:id}, (err, user)=>{
    if(err){
      res.render('404Error', {title: 'Error'});
    }else{
      if(!user){
        req.flash('error_msg', "No user is found with that id");
        console.log("No user is found with that id");
        res.redirect('/login');
       
      }else{
         res.render('userDetails', {title: "User Details", user: user});
      }
    }
  })
})

//Update user by id
router.get('/editUser/:id', ensureAuthenticated, (req, res)=>{
  const id = req.params.id;
  User.findOne({_id:id}, (err, user)=>{
    if(err){
      res.render('404Error', {title: 'Error'});
    }else{
      if(!user){
        req.flash('error_msg', "No user is found with that id");
        console.log("No user is found with that id");
        res.redirect('/login');
       
      }else{
         res.render('editData', {title: "Update user", user: user});
      }
    }
  })
 
})
//Post request for updation of user details

router.post('/editData',ensureAuthenticated,  (req, res)=>{
  const {_id, name, family, covid} = req.body;
  const isCovidPositive = covid=='Yes'? true: false;
  // res.send(isCovidPositive);
  const updatedUser = {
    name,
    numbOfFamilyMembers:family,
    isCovidPositive 
  }
  User.findByIdAndUpdate(_id, updatedUser, {new: true, useFindAndModify: false},(err, updated)=>{
    if(err){
      console.log(err);
    }else{
      // console.log(updated);
      req.flash('success_msg', 'Successfully updated the data');
      res.redirect('/users/userData');
    }
  })
})
// ensureAuthenticated, checkRole('Admin'), 
router.get('/displayComments',async (req, res)=>{
  const comments = await Comment.find({});

  let result={
    comments: []
  };
  comments.forEach((comment)=>{
    let msg = {
      email: comment.email,
      message: comment.message
    }
    // console.log(msg);
    result.comments.push(msg);
  });
  
  fs.writeFileSync('./public/pdfs/comments.json', JSON.stringify(result), function (err) {
    if (err) throw err;
    console.log('Written!');
  });
  // res.send("Success");
  // res.download('./public/pdfs/comments.json');
   res.render('displayComments', {comments: result.comments, title: "Comments"});
})
module.exports = router;
