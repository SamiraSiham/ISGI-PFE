const {model , Schema} = require('mongoose');

let reactionRoles = new Schema({
    GuildId : String,
    roles : Array
});

module.exports = model("ReactionRoles" , reactionRoles);