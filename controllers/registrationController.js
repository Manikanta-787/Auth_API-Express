import {createDocument,getDocument,updateDocument,updateDocumentWithEmail,updateField,getAllDocuments} from '../services/userRegistration.js';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
let app=express();

// serving static files
app.use(express.static(path.resolve('public')));



export class registrationClass{
     
   register(req,res,next){
     res.sendFile(path.resolve('public','signup.html'));
   }
 
   async  otpVerification(req,res,next){
        
        let recipantMail = req.body.mail;
        console.log(`recipant mail ${recipantMail}`);   //debug
        let getOTP = ()=>{
             return (Math.floor(Math.random()*900000 + 100000)).toString();
        };
 
        let otp = getOTP();
        req.session.otp = otp;
        req.session.mail = recipantMail ;
        let transport = nodemailer.createTransport(
                                     {
                                           host:"smtp.gmail.com",
                                           port:465,
                                           secure:true,
                                           auth:{
                                                user:process.env.sending_mail,
                                                pass:process.env.mail_password
                                           }
                                      }
       )
 
       let mailOptions={
             from:process.env.sending_mail,
             to:`${recipantMail}`,
             subject:"otp verification for signup",
             text:`your 6 digit otp for verfication is ${otp}`
       }
       
       try{
            await transport.sendMail(mailOptions);
            console.log("otp is sent");
            res.send('otp sent');
 
       }catch(error){
             console.log(error);
             res.status(500).send("Internal Error");
       }
 
 }
   login(req,res,next){
      res.sendFile(path.resolve('public','login.html'));
 }
  async  logincheck(req,res,next){
           let data=req.body;
           let currentPassword=data.password;
           let currentHashedPassword=crypto.createHash('sha-512').update(currentPassword).digest('hex');
           try{
                let userData = await getDocument(data.username);
 
                if(userData){
                     let  originalHashedPassword=userData.password;
               
                     if(currentHashedPassword === originalHashedPassword){
                          req.session.user = {username:userData.username};  // logging session

                          //  JWT token generation
                          let payload = {  username:userData.username , role :"user"};
                          let secret_key = process.env.SECRET_KEY ;   // SECRET KEY 
                          let options = {algorithm:"HS512",expiresIn:"10m",notBefore:"5s",subject:"user_authentication",issuer:"manikanta",audience:"browser_surfers"} ;
                          let token = jwt.sign(payload,secret_key,options);
                          
                          // sending the token througn hhtpOnly cookie
                          res.cookie("token",token,{maxAge:5*60*1000,sameSite:"strict",httpOnly:true});
                          req.session.token = token; // token is saved in session because of getdetails should be  a 'GET' request otherwise we can get details from  frontend form for getdetails in 'POST' request
                          res.status(200).send(`<h1 style='color:green;margin:auto;'>Succesfully Logged In
                               you have been sent with token</h1>`);
                     }else{
                       res.status(400).send(' provided password is incorrect');
                     }
                }else{
                     res.status(400).send(`username ${data.username} does not exists, signup first !!`);
                }
 
 
           }catch(error){
                res.status(500).send(error.message);
           }
 
 
 }
 
  async  logout(req,res,next){
      let userDetails = req.session.user;
      if(userDetails){
           req.session.destroy((error)=>{
                if(error){
                     res.send('error while logging out');
                }else{
                     res.status(200).send(`<h1 style='color:green;margin-left:500px;margin-right:300px;margin-top:250px;'>Successfully Logged Out</h1>`)
                }
           })
      }else{
           res.sendFile(path.resolve('public','login.html'));
      }
 }
  async  sendOTP(req,res,next){
       let data=req.body;
       let password=data.password;
       let hashedPassword=crypto.createHash('sha-512').update(password).digest('hex');
       data.password=hashedPassword;
      
       req.session.signupData={...data};
       res.sendFile(path.resolve('public','otp.html'))
  
 }
 
  async  signup(req,res,next){
 
      let userSentOtp = req.body.otp; 
      if(userSentOtp == req.session.otp){
           try{
                let userData= await createDocument(req.session.signupData);
                console.log(userData);
                if(userData){
                  res.status(201).json({data:userData,message:"successfull creation"});
                  
                }
          }catch(error){
             res.status(400).send("check the data carefully");
          }
      }else{
 
           console.log("otp verification failed");
           res.sendFile(path.resolve('public','otp.html'));
      }
 }

 async profile(req,res,next){
     if(req.session.token){

          let secret_key = process.env.SECRET_KEY ;   // SECRET KEY 
          let token = req.session.token ; // gettiing token from authorization header string
          try{
               var decoded_jwt = jwt.verify(token,secret_key);
          }catch(error){
               res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>your access token is invalid</h1>`);
          }
          let username = decoded_jwt.username;
          let profileDetails = await getDocument(username);
          res.status(200).json({profileDetails});
     }else{
          res.status(400).sendFile(path.resolve('public','login.html')); // redirects to login page for logging in
          res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>you need to login to view profile details</h1>`)
     }
     
 }
 async updateProfile(req,res,next){
     if(req.session.token){

          let secret_key = process.env.SECRET_KEY ;   // SECRET KEY 
          let token = req.session.token ; // gettiing token from authorization header string
         
          try{
               var decoded_jwt = jwt.verify(token,secret_key);
               var username = decoded_jwt.username ;
               req.session.user = username;
          }catch(error){
               res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>your access token is invalid</h1>`);
          }
          let userData = req.body ; // user sent data for updation
          let updatedDetails = await updateDocument(userData,username);
          res.status(200).json({updatedDetails});
     }else{
          res.status(400).sendFile(path.resolve('public','login.html')); // redirects to login page for logging in
          res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>you need to login to view profile details</h1>`)
     }
     
 }
 async updatePassword(req,res,next){
     if(req.session.token){

          let secret_key = process.env.SECRET_KEY ;   // SECRET KEY 
          let token = req.session.token ; // gettiing token from authorization header string
         
          try{
               var decoded_jwt = jwt.verify(token,secret_key);
               var username = decoded_jwt.username ;
               req.session.user = username;
          }catch(error){
               res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>your access token is invalid</h1>`);
          }

          let password = req.body.password ; 
          let confirmedPassword = req.body.confirmedPassword ; 
          
          if(password === confirmedPassword){      // password confirmation
               let newPassword = req.body.password ; 
               let hashedPassword = crypto.createHash('sha-512').update(newPassword).digest('hex');  // hashing the new password
               // let userData = {password:hashedPassword} ; // user sent data for updation
               let updatedDetails = await updateField(username,"password",hashedPassword);
               res.status(200).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>password updated successfully</h1>`);
          }else{
               res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>confirmed password should match with password</h1>`)
          }
   
     }else{
          res.status(400).sendFile(path.resolve('public','login.html')); // redirects to login page for logging in
          res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>you need to login to view profile details</h1>`)
     }
 }

async resetPassword(req,res,next){
     let userMail = req.body.mail ;
     let all_users_data = await getAllDocuments();
     if (all_users_data){
          var all_mails = all_users_data.map((user)=>{return user.mail}) ;
          if(all_mails.includes(userMail)){

               //   res.redirect('otpVerification') ;if u consider form , redirectiong to otp verification route which sends the otp and stores it in session (req.session.otp)
               
               res.status(200).send("approach for otp verification")
          }else{
               res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>you have not created an account yet !!</h1>`)
          }
     }else{

          res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>you have not created an account yet !!</h1>`)
     }

}
async otpValidation(req,res,next){

     let userSentOTP = req.body.otp ;
     console.log(req.session.mail);
     if(userSentOTP == req.session.otp){
          console.log("otp verified successfully");
          // res.redirect('setNewPassword'); incase for form rendering 
          res.status(200).send("approach for setting new password");

     }
}
async setNewPassword(req,res,next){
     let password = req.body.password ; 
     let confirmedPassword = req.body.confirmedPassword ; 
     let mail = req.session.mail ;
     console.log(mail);
     if(password === confirmedPassword){      // password confirmation
          let newPassword = req.body.password ; 
          let hashedPassword = crypto.createHash('sha-512').update(newPassword).digest('hex');  // hashing the new password
          console.log(hashedPassword);
          // let userData = {password:hashedPassword} ; // user sent data for updation
          
        
          let updatedDetails = await updateDocumentWithEmail(mail,hashedPassword);
          res.status(200).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>password reset successfully</h1>`);
     }else{
          res.status(400).send(`<h1 style='color:red;margin-left:400px;margin-top:300px;'>confirmed password should match with password</h1>`)
     }
}
}

// sendOtp --> for otp verification page (front-end)
// otpVerification --> for sending the otp from server
//signup --> verifies the otp and saves the user registration details in database
// otpValidation --> just for otp validation (reset password purpose)