const Joi = require('joi');

const animeSchema = Joi.object({
    name:Joi.string().required().min(1),
    big_image:Joi.string().uri().required(),
    cover_image:Joi.string().uri().required(),
    desc:Joi.string(),
    fld_id:Joi.number().required(),
    nepisodes:Joi.number(),
    nseasons:Joi.string().pattern(new RegExp('^([0-9]+[ ])*[0-9]+$')),
})



module.exports = {animeSchema}

