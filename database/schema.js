import mongoose from 'mongoose';
let userSchema = new mongoose.Schema({

    firstName:String,
    lastName:String,
    username: { 
        
        type:String,
        required:[true,"username is required"] 
    },
    mail: { 
        
        type:String,
        required:[true,"mail id is required"]
    },
    mobile: { 

        type:Number, 
        required:[true,"mobile number is required"]
    },
    password: {

        type:String,
        minLength:[8,"password should have atleast 8 characters"],
        required:[true,"password is required"]
    },
    createdAt: {

        type:Date,
        default:Date.now()
    }

});


let userRegistration = mongoose.model("userRegistration",userSchema);
export default userRegistration;