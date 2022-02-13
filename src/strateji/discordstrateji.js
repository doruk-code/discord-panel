const DiscordStrateji = require("passport-discord").Strategy;
const passport = require("passport");
const db = require("quick.db");
const DiscordUser = require("../models/DiscordUser");

passport.serializeUser((user, done) => {
  console.log("Serialize");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialize");
  const user = await DiscordUser.findById(id);
  if (user) done(null, user);
});
//////////////////
passport.use(
  new DiscordStrateji(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await DiscordUser.findOne({ discordId: profile.id });
        if (user) {
          console.log("User exists.");
          done(null, user);
        } else {
          console.log("User not exists.");
          const newUser = await DiscordUser.create({
            discordId: profile.id,
            username: profile.username,
            guild: profile.guilds,
          });
          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
