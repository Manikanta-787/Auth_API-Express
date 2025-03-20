import mongoose from'mongoose';

let mongodbURI="mongodb://localhost:27017/registrations";

let connectDB= async function(){
         try{
             await mongoose.connect(mongodbURI);
             console.log("connected to database successfully");
         }
         catch(error){
            console.log(error.message);
         }
}

connectDB() // get called when file is imported in app.js