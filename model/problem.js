const mongoose = require("mongoose")
const schema = mongoose.Schema;


const problemSchema = new mongoose.Schema(
    {
        problemCode:{
            type:String,
            require:[true,'Please Enter the Unique Code for Problem'],
            min: [3, "Code should be of atleast 3 alphabets"],
        },
        title:{
            type:String,
            require:[true,'Please Enter the Problem Title'],
            min: [3, "Name should be of atleast 2 alphabets"],
        },
        description:{
            type:String
        },
        created_by:{
            type:mongoose.Types.ObjectId,
            ref:"user"
        }
    },
    { timestamps:true }
);

module.exports = mongoose.model("problem", problemSchema, "problem");
