const asyncWrapper = require("../util/asyncWrapper");
const User = require("../model/user")
const Problem = require("../model/problem");
const {createCustomError} = require('../errors/customAPIError')
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");
const testcase = require("../model/testcase");

const addProblem = asyncWrapper(async (req,res,next)=>{
    try{
        const { problemCode, title, description,input,output } = req.body;
        const isExists = await Problem.findOne({problemCode:problemCode});
        if (isExists) {
            const message = "ProblemCode is already Taken";
            return next(createCustomError(message, 406));
        }
        const result = await Problem.create({...req.body,...{created_by:req.user.userId}});
        if(!result){
            const message = "Something Went Wrong, Please check to Problem Details";
            return next(createCustomError(message, 406));
        }
        const tests = await testcase.create({
            questionId:result._id,
            input :input,
            output:output,
            created_by:req.user.userId
        })
        if(!tests) return next(createCustomError("Error in Tests", 406));
        return res.json(sendSuccessApiResponse(`Problem Is SuccessFully Added With CodeName ${problemCode}`));
    }
    catch(err){
        return next(createCustomError(err,400));
    }
})
//Update Problem
const updateProblem = asyncWrapper(async(req,res,next)=>{
    try{
        const { title, description,input,output } = req.body;
        const id = req.params.id;
        const isExists = await Problem.findById(id);
        if (!isExists) {
            const message = "Problem Not Exist";
            return next(createCustomError(message, 406));
        }
        await Problem.updateOne({_id:id},{
            title:title,
            description:description
        });
        if(input || output){
            await testcase.updateOne({questionId:id},{
                input:input,
                output:output
            })
        }
        return res.json(sendSuccessApiResponse(`${isExists.problemCode} Problem Is SuccessFully Update`));
    }
    catch(err){
        return next(createCustomError(err,400));
    }
})

// Delete Problem

const deleteProblem = asyncWrapper(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const isExists = await Problem.findById(id);
        if (!isExists) {
            const message = "Problem Not Exist";
            return next(createCustomError(message, 406));
        }
        await Problem.findByIdAndDelete(id);
        await testcase.deleteMany({questionId:id});
        return res.json(sendSuccessApiResponse(`${isExists.problemCode} Problem Is SuccessFully Deleted`));
    }
    catch(err){
        return next(createCustomError(err,400));
    }
})

module.exports = {
    addProblem,
    updateProblem,
    deleteProblem
}