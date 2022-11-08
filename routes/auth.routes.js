const express = require("express");
const router =express.Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const mongoose = require('mongoose');

const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware.js');


//GET home page //
router.get("/", (req, res, next) => {
  res.render("index.hbs", {style:'home.css'});
});

//GET sign up page
router.get("/signup", (req, res, next)=> {
  res.render("signup.hbs", {style:'login.css'})
})

//POST sign up page
router.post("/signup", (req, res, next)=> {
  console.log(req.body)

  //Getting the values that have been input from the body and storing them in variables
  const myUsername=req.body.username
  const myPassword=req.body.password

  if (!myUsername || !myPassword ) {
    res.render("signup", {errorMessage: 'All fields are mandatory. Please provide your username and password.'})
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(myPassword)) {
    res.status(500)
      .render("signup", { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.'});
    return;
  }

  //BCRYPT
  const myHashedPassword = bcryptjs.hashSync(myPassword);

  User.create({
    username: myUsername,
    password: myHashedPassword
  })
  .then(savedUser => {
    console.log(savedUser)
    res.redirect("/login")
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('signup', {
         errorMessage: 'This username is already in use.'
      });
    } else {
      next(error);
    }
  })
})

//GET login route
router.get("/login", isNotAuthenticated, (req, res, next)=> {
  res.render("login.hbs", {style:'login.css'})
})

//POST login route
router.post("/login", (req, res, next)=> {
  console.log(req.body)

  const myUsername=req.body.username
  const myPassword=req.body.password

  if (myUsername === '' || myPassword === '') {
    res.render('login', {
      errorMessage: 'Please enter both username and password to login.'
    });
    return;
  }

  User.findOne({
    username: myUsername
  })
  .then(foundUser => {
    
    //check if usernames match
    if(!foundUser) {
      res.render("login", {
        errorMessage: 'No user matching this username'
      });
      return;
    } 
    
    //function is going to rehash password and compare it with the one stored in the DB
    //returns true or false and stores it in a var
    const isValidPassword = bcryptjs.compareSync(myPassword, foundUser.password)

    //check if passwords match
    if(!isValidPassword){
      res.render('login', { errorMessage: 'Incorrect password.' });
      return;
    }

    //setting up a session and storing a user there
    req.session.user=foundUser;

    res.redirect("/my-list")
    
  })
  .catch(err => {
    console.log(err)
    res.send(err)
  })
})

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
