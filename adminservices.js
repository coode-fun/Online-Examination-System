var pool=require("./connection.js");
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
var mailed=require('./email-verification.js')

let admininstance=null;

class Adminservice{
    static getAdminServiceInstance()
    {
        return admininstance?admininstance:new Adminservice();
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
                        connection.query(`SELECT Active from admins WHERE Id=${id}`,(err,result)=>{
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

module.exports=Adminservice;

