const mongoose = require("mongoose")
const schema = mongoose.Schema;

const testCaseSchema = new mongoose.Schema(
    {
        questionId:{
            type:mongoose.Types.ObjectId,
            require:[true,'Please give the QuestionID for Problem'],
            ref:"problem"
        },
        input:{
            type:String,
            require:[true,'Please Enter Input for the Problem'],
        },
        output:{
            type:String,
            require:[true,'Please Enter Output for the Problem'],
        },
        created_by:{
            type:mongoose.Types.ObjectId,
            ref:"user"
        }
    },
    { timestamps:true }
);

module.exports = mongoose.model("testCase", testCaseSchema, "testCase");
