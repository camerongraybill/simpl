"use strict";
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const facebookStrategy = require("passport-facebook");
const index = require("./routes/index").router;
const users = require("./routes/users").router;

const config = require("./config");

const app = express();

const User = require("./models/models").user.Model;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

passport.use(new facebookStrategy({
    clientID: config.facebookSettings.id,
    clientSecret: config.facebookSettings.secret,
    callbackURL: "http://simpl.eastus.cloudapp.azure.com/auth/facebook/callback"
},
    (accessToken, refreshToken, profile, callback) => {
        const newGuy = new User();
        newGuy.fullName = profile.displayName;
        newGuy.accessToken = accessToken;
        newGuy.refreshToken = refreshToken;
        console.log({
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile,
            callback: callback,
            user: newGuy.toJSON()
        });
        newGuy.save((err) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(null, newGuy.toJSON());
            }
        });

    }));

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get("/auth/facebook/callback", passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res) => {
    res.redirect("/");
});

const session = require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
});

app.use(session);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "html")));

app.use("/", index);
app.use("/users", users);

// catch 404 and forward to error handler

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
