const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema} = require("./schema");
const {reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res , next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in");
        res.redirect("/login");
    }else{
        next();
    }
};

module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req , res , next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not the owner of this listing");
        res.redirect(`/Listings/${id}`);
    }else{
        next();
    }

};


//Schemna vaalidation Using Joi For Listings
module.exports.validateListing = (req , res , next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error);
        throw new ExpressError( 400 , errMsg); 
    }
    else{
        next();
    };
};


//validation for reviewShema
module.exports.validateReview = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error);
        throw new ExpressError( 400 , errMsg); 
    }
    else{
        next();
    };
};


module.exports.isReviewAuthor = async (req , res , next) => {
    let {id , reviewId} = req.params;
    const review = await Review.findById(reviewId);

    // console.log(review.author._id);

    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not the auther of this review");
        res.redirect(`/Listings/${id}`);
    }else{
        next();
    }

};
