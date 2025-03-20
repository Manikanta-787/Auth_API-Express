import {registrationClass} from '../controllers/registrationController.js';
import express from 'express';
import path from 'path';
let router = express.Router();

let registrationObject = new registrationClass()

// serving static files
router.use(express.static(path.resolve('public')));

// create user or signup page 
router.get('/register',registrationObject.register);  // register or signup page
router.post('/otpVerification',registrationObject.otpVerification);  // otp verification page
router.post('/sendOTP',registrationObject.sendOTP);    // otp sending logic
router.post('/signup',registrationObject.signup);      // signup logic
router.get('/login',registrationObject.login);   // login page
router.post('/logincheck',registrationObject.logincheck);   //login logic
router.get('/logout',registrationObject.logout);  // logout logic
router.get('/profile',registrationObject.profile); // profile logic
router.put('/updateProfile',registrationObject.updateProfile); // profile updation logic
router.patch('/updatePassword',registrationObject.updatePassword); // update password logic
router.post('/resetPassword',registrationObject.resetPassword) ; // password reset logic
router.post('/otpValidation',registrationObject.otpValidation) ; // otp validation logic
router.patch('/setNewPassword',registrationObject.setNewPassword) ; // password reset without jwt token


export default router;
