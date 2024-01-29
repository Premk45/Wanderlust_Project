const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn , isOwner , validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({storage});


router.route("/")
    //Home Route Index All Listing
    .get( wrapAsync(listingController.index))

    //Create Listing
    .post(isLoggedIn  , upload.single('listing[image]') , validateListing , wrapAsync(listingController.creatListing)
    // .post(upload.single('listing[image]') , (req ,res) => {
    //     res.send(req.file);
    // })
);


// New Listing Route
router.get("/new" , isLoggedIn , listingController.renderNewListing);


router.route("/:id")
    // Show Route
    .get(wrapAsync(listingController.showListing))

    //Update Listing
    .put(isLoggedIn , isOwner , upload.single('listing[image]'), validateListing , wrapAsync(listingController.updateListing))

    // Destroy Listing Route
    .delete(isLoggedIn , isOwner , wrapAsync(listingController.deleteListing)
);



// Edit Listing Route
router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(listingController.editListing));


module.exports = router;