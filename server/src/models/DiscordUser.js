const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // _id : {type : ObjectId , required : true , unique : true},
    discordId : {type : String , required : true},
    discordTag : {type :String , required : true},
    avatar : {type :String , required : true},
    guilds : {type : Array , required : true}
});

const DiscordUser = module.exports = mongoose.model('User', userSchema); 