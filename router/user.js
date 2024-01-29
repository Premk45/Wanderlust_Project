const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");


router.route("/signUp")

    // signUp Form Route
    .get(userController.signUpForm)

    // signUp Route
    .post(wrapAsync (userController.signUp)
);


router.route("/login")

    // Login Form Router
    .get(userController.loginForm)

    // Login Router
    .post(saveRedirectUrl , 
        passport.authenticate("local" , {
        failureRedirect : "/login",
        failureFlash : true,
    }),
    userController.login,
);


//Logout Router
router.get("/logout" , 
    userController.logout
);

module.exports = router;