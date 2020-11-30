const express = require('express');
const router = express.Router();
// const moment = require('moment');
const Comment = require('../models/Comment');
const Covid = require('../models/CovidData');
const { ensureAuthenticated, forwardAuthenticated, checkRole} = require('../config/auth');
const {states, main1} = require('../util/getCovid');

// app.use(express.static('public'));
router.get('/showChart', (req, res)=>{
    // res.sendFile(__dirname+"/index.html");
    res.render('chartPage');
});
router.get('/storeCovidData', async (req, res)=>{
  await main1();
})
router.get('/getData',  async (req, res)=>{
  
  Covid.find({}).sort({date: -1}).exec((err, result)=>{
    const { totalCases, cured, deaths} = result[0];
    //Send the whole latest data to the client
   res.json({states, totalCases, cured, deaths});
})
    // res.json(data);

});
router.get('/covidTable', async (req, res)=>{
  // main1();
  Covid.find({}).sort({date: -1}).exec((err, result)=>{
        const { totalCases, cured, deaths} = result[0];
        //Send the whole latest data to the client
        res.render('covidTable', {title: "Covid Table", states, totalCases, cured, deaths});
  })
})
router.get('/chart',  (req, res)=>{
  // await main1();
  res.render('covidChart', {title: "Chart"});
})
router.get('/getDataById/:index', async (req, res)=>{
  const index = req.params.index;
  Covid.find({}).sort({date: -1}).exec((err, result)=>{
    //result[0] contains the latest retrieved Covid data in the database
    const { totalCases, cured, deaths} = result[0];
    //Send data of only one particular state
    res.json({state: states[index], total: totalCases[index], cured: cured[index], deaths: deaths[index]});
})


  // res.json("hello");
})
// Welcome Page

router.get('/', (req, res) => {

  res.render('welcome', {title: "Welcome"});
});

// Dashboard
router.get('/dashboard',  ensureAuthenticated, checkRole("User"),(req, res) =>{
  res.render('dashboard', {
    user: req.user,
    title: req.user.name
  });
});
router.get('/dashboard-admin', ensureAuthenticated, checkRole("Admin"),(req, res) =>{

    res.render('dashboard-admin', {
      user: req.user,
      title: 'Admin Page'
    })

  });
//Contact us form
router.get('/comment', (req, res)=>{
  res.render('contactus', {title: "Contact Us"});
})
//Post a user comment
router.post('/comment', (req, res)=>{
  const {email, message} = req.body;

  const comment= new Comment({
    email,
    message
  })
  comment.save().then(
    ()=>{
      console.log("Saved successfully");
    }
  ).catch((error)=>{
    console.log("Error is "+error);
  })
  req.flash('success_msg', "Successfully posted your comment!!");
  res.redirect('/comment');
})
module.exports = router;
