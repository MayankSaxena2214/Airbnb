const Listing=require("../models/listing");
// const mbxClient = require('@mapbox/mapbox-sdk');
// const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAPBOX_TOKEN;
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}
module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
}
module.exports.showListing=async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you requersted does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
    // console.log(); //response is a very big object and we are  mainly concerned to get our coordinate which is in the feature.body
    // for new delhi the response.body.features will be 
    // [
    //     {
    //       id: 'place.31664235',
    //       type: 'Feature',
    //       place_type: [ 'place' ],
    //       relevance: 1,
    //       properties: { mapbox_id: 'dXJuOm1ieHBsYzpBZU1vYXc', wikidata: 'Q987' },
    //       text: 'New Delhi',
    //       place_name: 'New Delhi, Delhi, India',
    //       bbox: [ 76.942051, 28.404263, 77.347105, 28.883588 ],
    //       center: [ 77.209006, 28.613895 ],
    //       geometry: { type: 'Point', coordinates: [Array] },
    //       context: [ [Object], [Object], [Object] ]
    //     }
    //   ]
    let url=req.file.path;
    let filename=req.file.filename;
    
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing created");
    res.redirect("/listings");
}
module.exports.renderEditForm=async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requersted does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async (req,res)=>{
    
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}