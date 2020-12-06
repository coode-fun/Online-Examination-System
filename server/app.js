const express=require('express');
const dbservices=require('./dbservices');
const cors=require('cors');
const fs=require('fs');
const path=require('path');
//const signin=require('../registration-authentication/signin_page.html');

//const question=require('C:\Users\Aditya Singh\Desktop\online examinaion system\Online-Examination-System-master\js\question.js')

const app=express();
app.use(cors());
app.use(express.json()); //file sharing in jason format
app.use(express.urlencoded({extended : false}));

app.use(express.static(path.join(__dirname,"../registration-authentication")));
app.use(express.static(path.join(__dirname,"../front")));
app.use(express.static(path.join(__dirname,"../css")));
app.use(express.static(path.join(__dirname,"../image")));

app.post('/insert',(req,res)=>{

    console.log(req.body.question,req.body.option1,req.body.option2,req.body.option3,req.body.option4,req.body.correct);
    const db=dbservices.getDbServiceInstance();
    const result=db.insertData(req.body.question,req.body.option1,req.body.option2,req.body.option3,req.body.option4,req.body.correct);
    result
    .then(data=>res.json({data:data}));

});

app.get('./login',(req,res)=>{

   var paath=path.join(__dirname,'../front/account-verified');
   console.log(paath);
   res.sendFile(paath);
  // res.send("hello");
});


app.get('/getAll',(req,res)=>{

    const db=dbservices.getDbServiceInstance();
    const result=db.getAllData();
    result.
    then(data=>res.json({data:data}));

});

app.get('/verify/:id',(req,res)=>{

    console.log(req.body);
    const id=req.params.id;
    const db=dbservices.getDbServiceInstance();
          db.verified(id);
    res.redirect("/");   
});

//delete question from OS
app.delete("/delete/:Id",(request,response)=>{

    const id=request.params.Id;
    const db = dbservices.getDbServiceInstance();
    const result = db.deleteData(id);
    result
    .then(data => response.json({ success: data}))
    .catch(err => console.log(err));
});

app.post("/register",(req,res)=>{

    const db=dbservices.getDbServiceInstance();
    const result=db.register(req.body);
    result.
    then(data=>res.json(data));
    
});

app.post("/authenticate",(req,res)=>{

    console.log("authenticating  !")
    const db=dbservices.getDbServiceInstance();
    const result=db.authenticate(req.body);
    result
    .then(data=>{
        console.log(data);
        res.json(data);
    });
});

app.listen(5000,()=>{
    

    console.log("Server is running at http://localhost:5000");
})

