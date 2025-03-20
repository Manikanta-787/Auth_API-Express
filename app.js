import express from 'express';
import dotenv from 'dotenv';
import registrationRouter from './routes/userRegistrationRoutes.js';
import './database/dbConnection.js';
import session from 'express-session';
dotenv.config();

let app=express();
app.use(session({
        secret:"rinkatoki",
        resave:false,
        saveUninitialized:false,
        cookie:{
            
            maxAge : 1000*60*60*24,   // 1 day 
            httpOnly:true,
            sameSite:true,
        }
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',registrationRouter);

let port=process.env.port || 3000;

app.listen(port,()=>{
    console.log(`server started listening at port ${port}`);
})