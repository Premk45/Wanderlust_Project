const Listing = require("../models/listing");
const Review = require("../models/review");


// Creat Review
module.exports.createReview = async (req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    // console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "Review Is Submitted!");

    console.log("review is saved");
    res.redirect(`/Listings/${listing.id}`);
};


// Destroy Review
module.exports.destroyReview = async (req , res) => {
    // console.log(req.params);
    let {id , reviewId} = req.params;
    // console.log(req.params);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "Review Is Deleted!");
    res.redirect(`/Listings/${id}`);

};