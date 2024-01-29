const User = require("../models/user");

// signUp Form
module.exports.signUpForm = (req , res) => {
    res.render("users/signUp.ejs");
};

// signUp
module.exports.signUp = async (req , res) => {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({username , email});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to Wanderlust");
            res.redirect("/Listings");
        })
    }catch(error){
        req.flash("error" , error.message);
        res.redirect("/signUp");
    }
};


// Login Form
module.exports.loginForm = (req , res) => {
    res.render("users/login.ejs");
};


// Login
module.exports.login = (req , res) =>{
    req.flash("success" , "Welcome Back To Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/Listings"
    res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req , res , next) =>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out successfully!");
        res.redirect("/Listings");
    })
};