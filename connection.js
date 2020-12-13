const mysql=require("mysql");
const dotenv=require("dotenv");


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

module.exports=pool;