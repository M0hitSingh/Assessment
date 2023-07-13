const asyncWrapper = require("../util/asyncWrapper");
const User = require("../model/user")
const Problem = require("../model/problem");
const {createCustomError} = require('../errors/customAPIError')
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");

const addProblem = asyncWrapper(async (req,res,next)=>{
    try{
        const { name, statement, testcase } = req.body;
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