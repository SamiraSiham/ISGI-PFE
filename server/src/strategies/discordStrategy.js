const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const DiscordUser = require("../models/DiscordUser");

passport.serializeUser((user, done) => {
  // console.log("serializing user");
  // console.log(user);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  // console.log("deserializing user");
  // const user = await DiscordUser.findById(id);
  // done(null, user);
  try{
    // console.log("deserializing user");
    const user = await DiscordUser.findById(id);
    return user ? done(null , user) : done(null , null);
  }catch(err){
    console.log(err);
    done(err , null);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT,
      scope: ["identify", "email", "guilds"],
    },
    async function (accessToken, refreshToken, profile, cb) { //cb = callback function
      try {
        const {id , username , discriminator , avatar , guilds} = profile;
        const user = await DiscordUser.findOneAndUpdate({ discordId: profile.id } , {
            discordTag : `${username}#${discriminator}`,
            avatar : avatar,
            guilds : guilds
        },{
            new : true
        });
        if (user) {
          cb(null, user);
        } else {
          const newUser = await DiscordUser.create({
            discordId: profile.id,
            // username: profile.username,
            discordTag : `${username}#${discriminator}`,
            avatar : avatar,
            guilds : guilds
          });
          const saveUser = await newUser.save();
          cb(null, saveUser);
        }
      } catch (error) {
        console.log(error);
        cb(error, null);
      }
    }
  )
);
