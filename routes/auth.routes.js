const express = require("express");
const router =express.Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware.js');


//GET home page //
router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

//GET sign up page
router.get("/signup", (req, res, next)=> {
  res.render("signup.hbs")
})

//POST sign up page
router.post("/signup", (req, res, next)=> {
  console.log(req.body)

  //Getting the values that have been input from the body and storing them in variables
  const myUsername=req.body.username
  const myPassword=req.body.password

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
  .catch(err => {
    console.log(err)
    res.send(err)
  })
})

//GET login route
router.get("/login", isNotAuthenticated, (req, res, next)=> {
  res.render("login.hbs")
})

//POST login route
router.post("/login", (req, res, next)=> {
  console.log(req.body)

  const myUsername=req.body.username
  const myPassword=req.body.password

  User.findOne({
    username: myUsername
  })
  .then(foundUser => {

    console.log(foundUser);
    
    //check if usernames match
    if(!foundUser) {
      res.send("no user matching this username")
      return;
    } 
    
    //function is going to rehash password and compare it with the one stored in the DB
    //returns true or false and stores it in a var
    const isValidPassword = bcryptjs.compareSync(myPassword, foundUser.password)

    //check if passwords match
    if(!isValidPassword){
      res.send("incorrect password");
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


// //GET my-list route
// router.get("/my-list", (req, res, next)=> {
//   //if user's data is in a session, use it in hbs
//   if(req.session.user) {
//     res.render("my-list.hbs", {username: req.session.user.username})
//   } else {
//     res.render("my-list.hbs", {username: "Stranger"})
//   }
// })

// //Protected route
// router.get('/protected', isAuthenticated, (req, res, next)=>{
//   res.send('this is protected route')
// })




module.exports = router;
