import path from 'path';
import userRegistration from'../database/schema.js';

export async function getAllDocuments(){

    try{
        let usersData = await userRegistration.find() ;
        return usersData ;
    }catch(error){
             console.log(error.message);
    }
        
}
export   async function createDocument(data){

        try{
            let userData = await userRegistration.insertOne({...data});
            // console.log(userData);
            return userData;
        }catch(error){
            console.log(error.message); 
        }
         
}

export   async function getDocument(username){
    try{
        let userData = await userRegistration.findOne({username});
        return userData;
    }catch(error){
        console.log(error.message); 
    }
     
}

export   async function updateDocument(data,username){
    try{
        let updatedData = await userRegistration.updateOne({username:username},{...data});
        return updatedData;
    }catch(error){
        console.log(error.message); 
    }
     
}
export async function updateDocumentWithEmail(mail,password){
    try{
        let updatedData = await userRegistration.updateOne({mail:mail},{password:password});
        return updatedData;
    }catch(error){
        console.log(error.message); 
    }
}
export   async function updateField(username,password){
    try{
        let updatedField = await userRegistration.updateOne({username},{password:password});
        return updateField;
    }catch(error){
        console.log(error.message); 
    }
     
}

