const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const favicon = require('express-favicon');

const app = express();

//compression
app.use(compression());


//cors
app.use(cors());
// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//Setting public directory as static files serving
  app.use(express.static(__dirname + '/public'));
 
// EJS
app.use(expressLayouts);
app.set('views',  [path.join(__dirname, 'views'),path.join(__dirname, 'views/covidData')]);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Favicon
app.use(favicon(__dirname+'/public/favicon.ico/'));

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}


app.listen(port, console.log(`Server started on port ${port}`));
