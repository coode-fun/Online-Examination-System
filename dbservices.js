const mysql=require("mysql");
const dotenv=require("dotenv");
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
var mailed=require('./email-verification.js')

let instance=null;
dotenv.config();

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'webapp',
    port:3306
});



pool.getConnection((err,connection)=>{
    if(err)
    {
        console.log("connection failed!! May be poor internet connection.");
    }
    else
    {
        console.log("Successfully connected!");
    }
});

class Dbservice{

    static getDbServiceInstance()
    {
        return instance?instance:new Dbservice();
    }

    // async sample(){
    //     try{
    //         console.log("Hello");
    //          const response= await new Promise((resolve,reject)=>{
    //          });
    //         }
    //         catch(error){
    //             console.log(error);
    //         }   
    //     } 
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
        // async isActiveByEmail(email){
        //     try{
        //          const response= await new Promise((resolve,reject)=>{
        //              pool.getConnection((err,connection)=>{
        //                  if(err){
        //                      console.log("Error in isactive function!");
        //                      reject(false);
        //                  }
        //                  else{
        //                     connection.query(`SELECT Active from users WHERE Email=${email}`,(err,result)=>{
        //                         if(err)
        //                         {
        //                             console.log("Something wrong with query in isactive function!!");
        //                             reject(false);
        //                         }
        //                         else{
        //                             if(result.length>0)
        //                             {
        //                                 if(result[0].Active)
        //                                 {
        //                                      resolve(true);
        //                                 }
        //                                 else{
        //                                      resolve(false);
        //                                 }
        //                             }
        //                             else
        //                             {
        //                                 resolve(false);
        //                             }
        //                         }
        //                    });
        //                 }
        //              })
        //          });
        //          return response;
        //         }
        //         catch(error){
        //             console.log(error);
        //         }   
        //     }     
    async getAllData(){
        try{
            console.log("Hello");
             const response= await new Promise((resolve,reject)=>{

                pool.getConnection((err,connection)=>{
                    if(err)
                    {
                        console.log("Error inside getAllData function");
                    }
                    const query='SELECT * FROM  os;';
                    connection.query(query,(err,result)=>{
                        connection.release();
                        if(err) 
                        {
                            reject(new Error(err.message));
                        }
                        else
                        {                       
                            resolve(result);
                        }
                   });
                });
             });
           
             return response;
        }
        catch(error){
                 console.log(error, "   error from getAllData function");
        }
    }
    async insertData(ques,opt1,opt2,opt3,opt4,corr){
        try{           
            const insertId = await new Promise((resolve, reject) => {

                pool.getConnection((err,connection)=>{
                        if(err)
                        {
                            console.log("Error inside insertData function");
                        }    
                        const query = `INSERT INTO OS (Question, Option1,Option2,Option3,Option4,Correct) VALUES ('${ques}','${opt1}','${opt2}','${opt3}','${opt4}',${corr});`;

                        connection.query(query, (err, rows) => {
                            connection.release();
                            if (err) {
                                console.log("SQL QUERY inside inesert data IS WRONG");
                                reject(new Error(err.message));
                            }
                            else
                            {
                                resolve(rows.insertId);
                            }
                        })
                    });
                });
              return {
                ID : insertId,
                Question : ques,
                Option1 :  opt1,
                Option2 :  opt2,
                Option3 :  opt3,
                Option4 :  opt4,
                Correct :  corr
            };
        } catch (error) {
            console.log(error," Error from InsertData function!!");
        }
    }

    async  deleteData(id)
    {
       try{
            let response=await new Promise((resolve,reject)=>{
                pool.getConnection((err,connection)=>{
                    if(err)
                    {
                        console.log("Error inside DeleteData function");
                    }    
                    const query=`Delete from os where id=${id};`;

                    connection.query(query,(err,result)=>{
                        connection.release();
                        if(err){
                             reject(new Error(err.message));
                        }
                        else{
                            if(result.affectedRows===1)
                                resolve(true);
                            else 
                                resolve(false);
                        }
                    });
                })
            });
            return response;
       }
       catch(error){
           console.log(error);
           return false;
       }
    }

    async register(body){
        try{     
            const response=await new Promise((resolve,reject)=>{
                pool.getConnection((err,connection)=>{
                    
                    if(err)
                    {
                        console.log("Error inside register function");
                    }    
                    var email=body.emailvalue;
                    var query='SELECT * FROM Users WHERE Email = ?';
                    connection.query(query,[email],(err,result)=>{
                        
                        if (err) {
                            console.log(err);
                            resolve({
                                status:false,
                                message:'there are some error with query !'
                            })
                        }
                        else if (result.length >0){
                            console.log(result);
                            resolve({
                                status:false,
                                message:'Registration Failed. Email already exits!'
                            })
                          }
                        else{
                            var encryptedString = cryptr.encrypt(body.passwordvalue);
                            var query="INSERT INTO users (Email,Fname,Lname,Enrollment,Password) values(?,?,?,?,?);";
                            connection.query(query,[body.emailvalue,body.firstnamevalue,body.lastnamevalue,body.enrollmentvalue,encryptedString],(err,result)=>{
                                connection.release();
                                if (err) {
                                    resolve({
                                        status:false,
                                        message:'Registration Failed.Email already exits!'
                                    });
                                  }
                                else{
                                    mailed(body.emailvalue,result.insertId);
                                    resolve({
                                        status:true,
                                        data:result,
                                        message:'Successfully Registered.Activation link sent to mail.'
                                    })
                                }
                            });
                        }
                        });
                    });
                });
            return response;            
        } catch (error) {
            console.log(error);
        }
    }
    async verified(id)
    {
        try{
                var query=`UPDATE Users  SET verified=true WHERE Id=${id}`;
                pool.getConnection((err,connection)=>{
                    if(err)
                    {
                        console.log("Error inside verified function");
                    }    
                    connection.query(query,(err,result)=>{
                        if(err)
                        { 
                            console.log(err);
                        }
                        else
                        {
                            console.log(result);
                        }
                    });
                });
            }
        catch(err){
                console.log(err," Error from verified function!! ");
        }
    }
    async logedout(id)
    {
        try{
            var query=`UPDATE Users  SET active=false WHERE Id=${id}`;
            pool.getConnection((err,connection)=>{
                if(err)
                {
                    console.log("Error inside logedout function");
                }    
                connection.query(query,(err,result)=>{
                    if(err)
                    { 
                        console.log(err);
                    }
                    else
                    {
                        console.log(result);
                    }
                });
            });
        }
        catch(err){
            console.log(err);
        }
    }
    
    async logedin(id)
    {
        try{
            console.log(id,"from logedin");
            const response=await new Promise((resolve,reject)=>{
            var query=`UPDATE Users  SET active=true WHERE Id=${id}`;
            pool.getConnection((err,connection)=>{
                if(err)
                {
                    console.log("Error inside logedin function");
                }    
                connection.query(query,(err,result)=>{
                    if(err)
                    { 
                        console.log(err);
                        resolve(false);
                    }
                    else
                    {
                        console.log("Activated!");
                        resolve(true);
                    }
                });
            });
         });   
        }
        catch(err){
            console.log(err);
        }
    }
    
    async authenticate(body){
        try{           
            const response=await new Promise((resolve,reject)=>{
                
            pool.getConnection((err,connection)=>{
                if(err)
                {
                    console.log("Error inside authenticate function");
                }    
                var query='SELECT * FROM users WHERE Email = ?';
                var email=body.emailvalue;
              
                var password=body.passwordvalue;
                connection.query(query,[email],(err,result)=>{
                    if (err) {
                        resolve({
                             status:false,
                             message:'there are some error with query'
                        })
                    }
                    else{
                        
                        if(result.length >0){
                            var decryptedString = cryptr.decrypt(result[0].Password);
                            if(password===decryptedString){
                                if(result[0].Verified)
                                {
                                    resolve({
                                        status:true,
                                        message:'successfully authenticated',
                                        info:result[0]
                                    })
                                }
                                else{
                                    resolve({
                                        status:false,
                                        message:'Registered but your account is not activated yet.Check your mail to activate.'
                                    })
                                }
                            }
                            else{
                                resolve({
                                    status:false,
                                    message:"Email and password does not match"
                                });
                          }
                      }
                      else{
                        resolve({
                            status:false,    
                            message:"Email does not exits"
                        });
                      }
                    }
                  });
            });
        });
        
        return response;            
    } 
    catch(error){
            console.log(error);
        }
    }
    async userDetails(id){
        try{           
            const response=await new Promise((resolve,reject)=>{
                
            pool.getConnection((err,connection)=>{
                if(err)
                {
                    console.log("Error inside authenticate function");
                }    
                var query='SELECT * FROM users WHERE Id = ?';
                connection.query(query,[id],(err,result)=>{
                    if (err) {
                        resolve({
                             status:false,
                             message:'there are some error with query',
                             info : "Nothing found"
                        })
                    }
                    else{
                        if(result.length>0){
                            
                            resolve({
                                status:true,
                                message:'successfully authenticated',
                                info:result[0]
                            })
                        }
                        else{
                            console.log(result.length,"Hello from");
                            resolve({
                                status:false,
                                message:'something went wrong',
                                info : "Nothing found"
                            })
                        }
                    }                
                });
            });
        });
        return response;            
    } 
    catch(error){
            console.log(error,"Error from getDetails");
        }
    }
}

module.exports=Dbservice; //exporting Dbservice Class

