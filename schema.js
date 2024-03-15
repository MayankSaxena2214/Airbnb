const Joi = require('joi'); //joi is a npm used for the schema validation  Search "joi dev"
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        // image:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        location:Joi.string().required()

    }).required()
})
// Validation in the reviews
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
})
// schema.js
//phind
// const Joi = require('joi');

// const listingSchema = Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.string().allow(''),
//     price: Joi.number().required().min(0),
//     country: Joi.string().required(),
//     location: Joi.string().required()
// });

// module.exports = listingSchema;