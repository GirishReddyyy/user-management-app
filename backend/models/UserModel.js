import { Schema,model } from "mongoose";

//Create User Schema with validations
//name,email,dob,no.
const userSchema=new Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"email already exists"]
    },
    dateOfBirth:{
        type:Date,
        required:[true,"Date of birth is required"]
    },
    mobileNumber:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
//Create User Model for User Schema

export const UserModel=model("user",userSchema)