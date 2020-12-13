var pool=require("./connection.js");
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
var mailed=require('./email-verification.js')

let studentinstance=null;

class Studentservice{
    static getStudentServiceInstance()
    {
        return studentinstance?studentinstance:new Studentservice();
    }

    async isactive(id){
        try{
             const response= await new Promise((resolve,reject)=>{
                 pool.getConnection((err,connection)=>{
                     if(err){
                         console.log("Error in isactive function!");
                         reject(false);
                     }
                     else{
                        connection.query(`SELECT Active from users WHERE Id=${id}`,(err,result)=>{
                            if(err)
                            {
                                console.log("Something wrong with query in isactive function!!");
                                reject(false);
                            }
                            else{
                                if(result.length>0)
                                {
                                    if(result[0].Active)
                                    {
                                         resolve(true);
                                    }
                                    else{
                                         resolve(false);
                                    }
                                }
                                else
                                {
                                    resolve(false);
                                }
                            }
                       });
                    }
                 })
             });
             return response;
            }
            catch(error){
                console.log(error);
            }   
        } 
    
}

module.exports=Studentservice;