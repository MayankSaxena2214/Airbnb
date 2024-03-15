const Listing=require("../models/listing");
const Review=require("../models/review");
//create review
module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    const listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log("Author ID:", newReview.author); // Add this line to log the author ID
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    console.log("New review saved");
    res.redirect(`/listings/${id}`);
}
//delete review
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}