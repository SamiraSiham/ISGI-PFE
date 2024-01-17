const router = require('express').Router();


function isAuthorized(req, res, next) {
    if(req.user){
        console.log("user is logged in");
        console.log(req.user);
        next();
    }else{
        console.log("user is not logged in");
        res.redirect('/');
    }
}


router.get('/', isAuthorized ,function(req, res){
    res.send("dashboard page");
});

// router.get('/' ,function(req, res){
//     res.sendStatus(200);
// });

router.get('/settings', isAuthorized , function(req, res){
    res.send("settings page");
})

module.exports = router;