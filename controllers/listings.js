const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index
module.exports.index = async (req , res) => {
    const Listings = await Listing.find();
    res.render("Listings/index.ejs" , {Listings} ); 
};


//New Listing Form
module.exports.renderNewListing = (req , res) => {
    res.render("Listings/new.ejs");
};


// Show Listing
module.exports.showListing = async (req , res) => {
    let {id} = req.params;
    const list = await Listing.findById(id).
    populate({path : "reviews" ,
    populate : { path : "author"},})
    .populate("owner");
    if(!list) {
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/Listings");    
    }else{
        res.render("Listings/show.ejs" , {list});
    }
    
};


// Create Listing
module.exports.creatListing = async (req , res) => {

    let result = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url , filename};
    newListing.owner = req.user._id;
    newListing.geometry = result.body.features[0].geometry;
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    res.redirect("/Listings");
};


// Edit Listing Form
module.exports.editListing = async (req , res) => {
    let {id} = req.params;
    const list = await Listing.findById(id);
    let originalImage = list.image.url;
    originalImage = originalImage.replace("/upload" , "/upload/h_100,w_200");
    if(!list) {
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/Listings");    
    }else{
        res.render("Listings/edit.ejs" , {list , originalImage});
    }
};


// Update Listing
module.exports.updateListing = async (req , res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , "Send Valid Listing Data!");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success" , "Listing Is Updated!");
    res.redirect(`/Listings/${id}`);
}


// Destroy Listing
module.exports.deleteListing = async (req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Is Deleted!");
    res.redirect("/Listings");
};