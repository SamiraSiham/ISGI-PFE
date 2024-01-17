const router = require('express').Router();
const welcomeSchema = require('../models/welcome');
const reactionRoles = require('../models/ReactionRoles');
const passport = require('passport');
const {getBotGuilds , getGuildRoles} = require('../utils/api');
const User = require('../models/DiscordUser');
const {getMutualGuilds} = require('../utils/utils');
router.get('/guilds' , async (req , res)=>{
    // res.sendStatus(200);
    const guilds = await getBotGuilds();
    const user = await User.findOne({
        discordId : req.user.discordId
    });
    if(user){
        const userGuilds = user.get('guilds');
        const mutualGuilds = getMutualGuilds(userGuilds , guilds);
        // console.log(mutualGuilds);
        res.send(mutualGuilds);
    }else{
        console.log("no user")
        return res.status(401).send({msg : 'unauthorized'});
    }
});

router.put('/guild/:guildId/welcomeMessage' , async (req , res)=> {
    const guildId = req.params.guildId;
    const {welcomeMessage} = req.body;
    if(!welcomeMessage) return res.status(400).send({msg : 'welcome message required'});
    const update = await welcomeSchema.updateOne({Guild : guildId} ,{
        $set : {
            Msg : welcomeMessage
        }
    });
    // return update ? res.send(update) : res.status(400).send({msg : "could not find document"});
    if(update.matchedCount < 1){
        return res.status(400).send({msg : "could not find document"});
    }else{
        return res.send(update);
    }
});

router.get('/guild/:id/config' , async (req , res)=>{
    const {id} = req.params;
    const data = await welcomeSchema.findOne({Guild : id});
    return data ? res.send(data) : res.status(404).send({msg : 'Not found'})
});

router.get('/guild/:id/roles' , async(req , res)=>{
    const {id} = req.params;
    try{
        const roles = await getGuildRoles(id);
        res.send(roles);
    }catch(err){
        console.log(err);
        res.status(500).send({msg : 'internal server error'});
    }
});

router.get('/guild/:id/reactionRoles' , async (req,res)=>{
    const {id} = req.params;
    const data = await reactionRoles.findOne({GuildId : id});
    return data ? res.send(data) : res.status(404).send({msg : 'Not Found'});
});

router.put('/guild/:id/:reactionRole' , async(req,res)=>{
    const id = req.params.id;
    const reactionRole = req.params.reactionRole;
    const data = await reactionRoles.findOne({GuildId : id});
    if(!reactionRole){
        res.status(404).send({msg : 'Role not found'});
    }else{
        const roles = data.roles;
        // res.send(roles);
        const findRoles = roles.find(r=>r.role === reactionRole);
        res.send(findRoles);
        if(findRoles){
            // res.send(findRoles)
            const filteredRoles = roles.filter(r=>r.role !== reactionRole);
            const update = await reactionRoles.updateOne({GuildId : id},{
                $set : {
                    roles : filteredRoles
                }
            });
            if(update.matchedCount < 1){
                return res.status(400).send({msg : "could not find document"});
            }
        }
    }
})


module.exports = router;