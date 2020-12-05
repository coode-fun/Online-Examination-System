const mysql=require("mysql");
const dotenv=require("dotenv");
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
var mailed=require('./email-verification.js')

let instance=null;
dotenv.config();

const connection=mysql.createConnection({
    host:process.env.HOST,
    user:'root',
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    port:process.env.DBPORT
});

connection.connect((err)=>{
    if(err){ 
             console.log("Connection failed!!");
             throw err;
    }
    else
    console.log("Database "+ process.env.DATABASE +" Successfully connected!!");
});

class Dbservice{

    static getDbServiceInstance()
    {
        return instance?instance:new Dbservice();
    }
    async getAllData(){
        try{
            console.log("Hello");
            
             const response= await new Promise((resolve,reject)=>{

                const query='SELECT * FROM  os;';
                connection.query(query,(err,result)=>{
                   if(err) reject(new Error(err.message));
                   resolve(result);
                });
             });
             console.log(response);
             return response;
        }
        catch{
                 console.log("Error");
        }
    }
    async insertData(ques,opt1,opt2,opt3,opt4,corr){
        try{           
            console.log("insert data",ques,opt1,opt2,opt3,opt4,corr);
            const insertId = await new Promise((resolve, reject) => {
                const query = `INSERT INTO OS (Question, Option1,Option2,Option3,Option4,Correct) VALUES ('${ques}','${opt1}','${opt2}','${opt3}','${opt4}',${corr});`;

                connection.query(query, (err, rows) => {
                    if (err) console.log("SQL QUERY IS WRONG");
                    else
                    resolve(rows.insertId);
                })
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
            console.log(error);
        }
    }
    async  deleteData(id)
    {
       try{
            let response=await new Promise((resolve,reject)=>{
               
                const query=`Delete from os where id=${id};`;

                connection.query(query,(err,result)=>{
                        if(err) reject(new Error(err.message));
                        if(result.affectedRows===1)
                        resolve(true);
                        else 
                        resolve(false);
                });
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
                
                var email=body.emailvalue;
                console.log(email);
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
                                if (err) {
                                    console.log(err);
                                    resolve({
                                        status:false,
                                        message:'Registration Failed.Email already exits!'
                                    });
                                  }else{
                                       //console.log(result.insertId);
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
            return response;            
        } catch (error) {
            console.log(error);
        }
    }
    async verified(id)
    {
        try{
              var response=new Promise((resolve,reject)=>{

                var query=`UPDATE Users  SET verified=true WHERE Id=${id}`;
                connection.query(query,(err,result)=>{

                });
                
              });
        }
        catch{

        }
    }
    async authenticate(body){
        try{           
            
            const response=await new Promise((resolve,reject)=>{
                
                var email=body.emailvalue;
                var password=body.passwordvalue;
               console.log("email ",email);
               console.log("password :",password);
                var query='SELECT * FROM users WHERE Email = ?';
                connection.query(query,[email],(err,result)=>{
                    if (err) {
                        resolve({
                          status:false,
                          message:'there are some error with query'
                          })
                    }else{
                      if(result.length >0){
                         var decryptedString = cryptr.decrypt(result[0].Password);
                          if(password===decryptedString){
                              resolve({
                                  status:true,
                                  message:'successfully authenticated'
                              })
                          }else{
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
            console.log(response);
            return response;            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports=Dbservice; //exporting Dbservice Class

