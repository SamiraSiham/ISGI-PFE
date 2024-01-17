const router = require('express').Router();
const passport = require('passport');



router.get('/discord', passport.authenticate('discord'));
router.get('/discord/redirect' , passport.authenticate('discord'),(req , res)=>{
    res.redirect('http://localhost:3000/guildMenu');
}
);

router.get('/' , (req,res)=>{
    if(req.user){
        res.send(req.user);
    }else{
        res.status(401).send({msg : 'unauthorized'});
    }
})

// in order to access this route the url must be : /auth/success

// router.get('/success' , (req , res)=>{
//     res.json({
//         msg : 'auth success',
//         status : 200
//     });
// });

module.exports = router;