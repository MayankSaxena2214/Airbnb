const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage }); //multer is used to handle the file upload like images because
//the mongo can't understand the image format  and dest is folder where the images will be saved


router
.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.createListing));





//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;