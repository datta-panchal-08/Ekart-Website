import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstname: {type: String,required:true},
    lastname:{type:String,required:true},
    profilepic:{type:String,default:""},
    profilePublicId:{type:String,default:""},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    role:{
        type:String,
        enum : ["user","admin"],
        default:"user"
    },
    token:{type:String,default:null},
    isVerified:{type:Boolean,default:false},
    isLoggedIn:{type:Boolean,default:false},
    otp:{type:String,default:""},
    otpExpiry:{type:Date,default:null},
    address:{type:String},
    city:{type:String},
    zipcode:{type:String},
    phoneNo:{type:String}
},{timestamps:true});

export const User = mongoose.model("User",userSchema);