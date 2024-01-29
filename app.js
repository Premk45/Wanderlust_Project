if (process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


//requiring all routers
const listingRouter = require("./router/listing");
const reviewsRouter = require("./router/review");
const userRouter = require("./router/user");


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "public")));


const dbUrl = process.env.ATLASDB_URL

main().then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error" , () => {
    console.log("Error in mongo session store" , err);
});

//session options
const sessionOption = { 
    store, 
    secret : process.env.SECRET , 
    resave: false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },
};


//Initial Route
// app.get("/" , (req , res) => {
//     res.send("Working");
// });


//using session and flash
app.use(session(sessionOption));
app.use(flash());


//using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware for flash messages and locals
app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})



//all routes
app.use("/listings" , listingRouter);
app.use("/Listings/:id/review" , reviewsRouter);
app.use("/" , userRouter);




// Template For All Types Of Error
app.use((err , req , res , next) => {
    let {status = 500 , message = "Something Went Wrong!"} = err;
    res.render("Listings/error.ejs" , {message, status});
    next();
})

// Page Not Found Error For Wrong Route
app.all("*" , (err , res , next) => {
    next(new ExpressError(404 , "Page Not Found!"));
});

// Listening Port For Server
app.listen("8080" , () => {
    console.log("app is listening");
} );

