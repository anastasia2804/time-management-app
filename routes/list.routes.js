const express = require("express");
const router =express.Router();
const User = require("../models/User.model");
const List = require("../models/List.model");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const e = require("express");

//GET route, create a new item on the list
router.get('/my-list', isAuthenticated, (req, res, next)=> {
    let username = req.session.user.username

    List.find({
        $and: [{userId: req.session.user._id}, {status:false}, {important:null}, {urgent: null}]
    })
    .then(listsArr => {
        res.render('my-list.hbs', {listsArr, username})
    })
    
})

//POST 
router.post('/my-list', isAuthenticated, (req, res, next)=> {
    const newTask = {
        description: req.body.description,
        important: null,
        urgent: null,
        userId: req.session.user._id,
        status: false
    };

    console.log(newTask)
    List.create(newTask)
    .then(createdTask => res.redirect('/my-list'))
    .catch(err => console.log(err))
})

// router.post('/my-list/:id/update', (req, res, next)=> {
//     console.log(req.body)
//     List.findByIdAndUpdate(req.params.id, {status: req.body.status == 'on'})
//     .then(foundTask => res.redirect('/my-list'))
//     .catch(err => console.log(err))
// })

router.post('/my-list/:id/update', (req, res, next)=> {
    console.log(req.body)
    List.findByIdAndUpdate(req.params.id, {important: req.body.important == 'yes', urgent: req.body.urgent == "yes"}, { new: true })
    .then(foundTask => res.redirect('/my-list'))
    .catch(err => console.log(err))
})



router.post('/my-list/:id/delete', (req, res, next) => {
    List.findByIdAndDelete(req.params.id)
    .then(()=>res.redirect('/my-list'))
    .catch(err=> console.log(err))
})

router.get('/priorities', isAuthenticated, (req, res, next) => {
    List.find({
        $and: [{userId: req.session.user._id}, {status: false}, {important: {$ne: null}}, {urgent: {$ne: null}}]
    })
    .then(tasksArr => {
        const importantUrgentArr = tasksArr.filter(el => {
            return el.urgent == true && el.important == true
        })
        const importantNonUrgentArr = tasksArr.filter(el => {
            return el.urgent == false && el.important == true
        })
        const urgentNotImportantArr = tasksArr.filter(el => {
            return el.urgent == true && el.important == false
        })
        const nonUrgentNotImportantArr = tasksArr.filter(el => {
            return el.urgent == false && el.important == false
        })
        res.render('priorities.hbs', {importantUrgentArr, importantNonUrgentArr, urgentNotImportantArr, nonUrgentNotImportantArr})
    })
    .catch(err => res.send(err))
})

router.post('/priorities/:id/update', (req, res, next)=> {
    console.log(req.body)
    List.findByIdAndUpdate(req.params.id, {status: req.body.status == 'on'})
    .then(foundTask => res.redirect('/priorities'))
    .catch(err => console.log(err))
})

router.post('/priorities/:id/edit', (req, res, next) =>{
    console.log(req.body)
    List.findByIdAndUpdate(req.params.id, {description: req.body.description}, { new: true })
    .then(foundTask => res.redirect('/priorities'))
    .catch(err => console.log(err))
})

router.post('/priorities/:id/delete', (req, res, next) => {
    List.findByIdAndDelete(req.params.id)
    .then(()=>res.redirect('/priorities'))
    .catch(err=> console.log(err))
})

router.get('/completed', isAuthenticated, (req, res, next)=> {

    List.find({
        $and: [{userId: req.session.user._id}, {status:true}]
    })
    .then(listsArr => {
        res.render('completed.hbs', {listsArr})
    })
})

router.post('/completed/:id/delete', (req, res, next) => {
    List.findByIdAndDelete(req.params.id)
    .then(()=>res.redirect('/completed'))
    .catch(err=> console.log(err))
})


module.exports = router;

