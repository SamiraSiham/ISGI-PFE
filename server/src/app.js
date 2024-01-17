require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const session = require('express-session');
const passport = require('passport');
const discordStrategy = require('./strategies/discordStrategy');
const db = require('./database/database');
const path = require('path');
const Store = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');

// mongodb connection
db.then(()=>console.log('Connected to mongodb')).catch(err=>console.log(err));

// routes
// const authRoute = require('./routes/auth');
// const dashboardRoute = require("./routes/dashboard");
const routes = require('./routes')

app.use(cors({
    origin : ['http://localhost:3000'],
    credentials : true
}));

app.use(express.json());
app.use(express.urlencoded({extended : false}));

// sessions:
app.use(session({
    secret : "random secret to test session",
    cookie:{
        maxAge : 60000 * 60 * 24
    },
    saveUninitialized : false,
    name : 'discord.oauth2',
    resave : false,
    store : new Store({
        mongoUrl : process.env.MONGODB_URI
    })
}));


// passport
app.use(passport.initialize());
app.use(passport.session());



// middleware routes
// app.use('/auth' , authRoute);
// app.use('/dashboard', dashboardRoute);

app.use('/api' , routes);

app.get('/logout', (req, res) => {
    // Clear or invalidate the session data
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      // Redirect the user to a desired page (e.g., login page)
      res.redirect('http://localhost:3000');
    });
  });
  



app.listen(process.env.PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
});