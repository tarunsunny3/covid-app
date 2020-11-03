const express = require('express');
const router = express.Router();
const moment = require('moment');
const Covid = require('../models/CovidData');
const { ensureAuthenticated, forwardAuthenticated, checkRole} = require('../config/auth');
const {states, main1} = require('../util/getCovid');

// app.use(express.static('public'));
router.get('/showChart', (req, res)=>{
    // res.sendFile(__dirname+"/index.html");
    res.render('chartPage');
});
router.get('/getData',  async (req, res)=>{
  await main1();
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

router.get('/', forwardAuthenticated, (req, res) => {
  // myFunc();
  res.render('welcome', {title: "Welcome"});
});

// Dashboard
router.get('/dashboard',  ensureAuthenticated, checkRole("User"),(req, res) =>{
 
  res.render('dashboard', {
    user: req.user
  })

 
});
router.get('/dashboard-admin', ensureAuthenticated,checkRole("Admin"),(req, res) =>{

    res.render('dashboard-admin', {
      user: req.user,
      title: 'Admin Page'
    })

  });


module.exports = router;
