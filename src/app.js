require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const session = require("express-session");
const passport = require("passport");
const DiscordStrateji = require("./strateji/discordstrateji");
const db = require("./database/database");
const path = require("path");
db.then(() => console.log("Baglandın mongoDB")).catch((err) =>
  console.log(err)
);

//ROUTER
const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");

app.use(
  session({
    secret: "dorq",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    saveUninitialized: false,
    name: "discord.oauth2",
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//PAROLA
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/dashboard", dashboardRoute);

app.get("/", isAuthorized, (req, res) => {
  res.render("home", {});
});

function isAuthorized(req, res, next) {
  if (req.user) {
    res.redirect("/dashboard");
  } else {
    next();
  }
}

app.listen(PORT, () => {
  console.log("Porta istek ${PORT}");
});
