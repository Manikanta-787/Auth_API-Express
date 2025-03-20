// import crypto from 'crypto';

// let password="mani@123";
// let hashedPassword=crypto.createHash('sha-512').update(password).digest('hex');
// console.log(hashedPassword.toString() === hashedPassword);
// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// dotenv.config();
// let payload={
//       name:"mani",
//       age:21
// }

// let secret_key = process.env.SECRET_KEY
// let key = crypto.randomBytes(64).toString('hex');
// console.log(key)

// let token = jwt.sign(payload,secret_key,{expiresIn:"5m",subject:"user_authentication",issuer:"mani",audience:"browser_surfers",notBefore:"5s",algorithm:"HS512"});
// console.log(typeof token);

// const decoded = jwt.verify(token,secret_key);
// console.log(decoded);

// try{
//       const decoded = jwt.decode(token);
//       console.log(decoded.name);
// }catch(error){
//       console.log(error.message);
// }