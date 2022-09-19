const express = require("express");
const router =express.Router();
const User = require("../models/User.model");
const List = require("../models/List.model");
const { isAuthenticated } = require("../middlewares/auth.middleware");

//GET route, create a new item on the list
router.get('/my-list', isAuthenticated, (req, res, next)=> {
    List.find({
        $and: [{userId: req.session.user._id}, {status:false}]
    })
    .then(listsArr => {
        res.render('my-list.hbs', {listsArr})
    })
    
})

//POST 
router.post('/my-list', isAuthenticated, (req, res, next)=> {
    const newTask = {
        description: req.body.description,
        important: req.body.important == "yes",
        urgent: req.body.urgent == "yes",
        userId: req.session.user._id,
        status: false
    };

    console.log(newTask)
    List.create(newTask)
    .then(createdTask => res.redirect('/my-list'))
    .catch(err => console.log(err))
})

router.post('/list/:id/update', (req, res, next)=> {
    console.log(req.body)
    List.findByIdAndUpdate(req.params.id, {status: req.body.status == 'on'})
    .then(foundTask => res.redirect('/my-list'))
    .catch(err => console.log(err))
})



module.exports = router;

