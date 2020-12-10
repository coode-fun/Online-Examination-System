const mysql=require("mysql");
const dotenv=require("dotenv");

let instance=null;
dotenv.config();


const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:web,
    port:process.env.DBPORT
});