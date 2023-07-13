const { createCustomError } = require("../errors/customAPIError");
const asyncWrapper = require("../util/asyncWrapper");

const adminRestrict = asyncWrapper(async(req,res,next)=>{
    if(req.user.details.role=="Admin") next();
    else next(createCustomError("Access Denied"));
})

module.exports = {adminRestrict};