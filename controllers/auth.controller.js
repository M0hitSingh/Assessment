const asyncWrapper = require("../util/asyncWrapper");
const User = require("../model/user")
const {createCustomError} = require('../errors/customAPIError')
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");

// Signup

const signup = asyncWrapper(async (req,res,next)=>{
    try{
        const { name, email, password } = req.body;
        const emailExists = await User.findOne({ email, isActive: true , isVerified:true});
        if (emailExists) {
            const message = "Email is already registered";
            return next(createCustomError(message, 406));
        }
        const user = await User.create(req.body);
        const response = {
            email:user.name,
            "access_token":user.generateJWT()
        }
        res.json(sendSuccessApiResponse(response));
    }
    catch(err){
        return next(createCustomError(err,400));
    }
})

//Login

const login = asyncWrapper(async (req,res,next)=>{
    try{
        const { email, password } = req.body;
        const emailExists = await User.findOne({email:email});
        if (!emailExists) {
            const message = "Email Not Exist";
            return next(createCustomError(message, 401));
        }   
        const isPasswordRight = await emailExists.comparePassword(password);
        if (!isPasswordRight) {
            const message = "Invalid credentials";
            return next(createCustomError(message, 401));
        }
        const data={
            "email":email,
            "access_token":emailExists.generateJWT()
        }
        res.json(sendSuccessApiResponse(data));
    }
    catch(err){
        return next(createCustomError(err,400));
    }
})

module.exports = {
    login,
    signup
}