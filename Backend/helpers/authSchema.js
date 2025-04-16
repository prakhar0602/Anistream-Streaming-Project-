const Joi = require('joi');

const loginSchema = Joi.object({
    email:Joi.string().email({tlds:{allow:['com','net']}}).required(),
    password:Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$'))
    .messages({
        "string.min":"The password must be atleast 8 characters long.",
        "string.pattern.base":"Password must include atleast one lowercase alphabet, one uppercase alphabet, one number and one special character"
    }).required()
})

const signupSchema = Joi.object({
    username:Joi.string().alphanum().min(3).required(),
    email:Joi.string().email({tlds:{allow:['com','net']}}).required(),
    password:Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$')).messages({
        "string.min":"The password must be atleast 8 characters long",
        "string.pattern.base":"Password must include atleast one lowercase alphabet, one uppercase alphabet and ne special character"
    }).required(),
    repeat_password:Joi.ref('password')
})



module.exports = {loginSchema,signupSchema};