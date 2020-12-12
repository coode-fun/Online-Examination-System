const express=require('express');
const dbservices=require('./dbservices');
const cors=require('cors');
const fs=require('fs');
const path=require('path');
const hbs=require("hbs");
// const { request } = require('https');
// const { response } = require('express');

const app=express();
app.use(cors());
app.use(express.json()); //file sharing in jason format
app.use(express.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,"/public")));

//app.set('views', path.join(__dirname));
// app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');


app.post('/insert',(req,res)=>{

    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!")
    }
    console.log(req.body.question,req.body.option1,req.body.option2,req.body.option3,req.body.option4,req.body.correct);
    const db=dbservices.getDbServiceInstance();
    const result=db.insertData(req.body.question,req.body.option1,req.body.option2,req.body.option3,req.body.option4,req.body.correct);
    result
    .then(data=>res.json({data:data}))
    .catch(err=>{console.log(err,"error from /insert catch")});
});

app.get("/home/admin-user.html",(req,res)=>{});
app.get("/registration-authentication/signin_page.html",(req,res)=>{});

app.get('/', function(req, res){ 
    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!");
    }
    // var options = { 
    //     root: path.join(__dirname,"/public/home") 
    // }; 
      
    // var fileName = 'admin-user.html'; 
    // res.sendFile(fileName, options, function (err) { 
    //     if (err) { 
    //         next(err); 
    //     } else { 
    //         console.log('Sent:', fileName); 
    //     } 
    // }); 
    res.redirect("/home/admin-user.html");
});
app.get('/front/account-verified.html',(req,res)=>{
    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!")
    }
//    var paath=path.join(__dirname,'public/front/account-verified.html');
//    console.log(paath);
//    res.sendFile(paath);
//   // res.send("hello");
});


app.get('/getAll',(req,res)=>{

    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!")
    }
    const db=dbservices.getDbServiceInstance();
    const result=db.getAllData();
    result.
    then(data=>res.json({data:data}))
    .catch(err=>{console.log(err,"error from /insert catch")});

});

app.get('/verify/:id',(req,res)=>{

    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!")
    }
    console.log(req.body);
    const id=req.params.id;
    //res.send("hello");
    const db=dbservices.getDbServiceInstance();
    db.verified(id);
    res.redirect("../front/account-verified.html");   
});

//delete question from OS
app.delete("/delete/:Id",(request,response)=>{

    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!")
    }
    const id=request.params.Id;
    const db = dbservices.getDbServiceInstance();

    const result = db.deleteData(id);
    result
    .then(data => response.json({ success: data}))
    .catch(err => console.log(err));
});

app.post("/register",(req,res)=>{

    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!")
    }

    const db=dbservices.getDbServiceInstance();
    const result=db.register(req.body);
    result.
    then(data=>res.json(data))
    .catch(err=>{console.log(err,"error from /insert catch")}); 
});

app.get("/user-login/:id",(request,response)=>{
    const id=request.params.id;
    const db=dbservices.getDbServiceInstance();
       
    db.logedin(id)
    .catch(err=>{console.log(err)});
    response.redirect(`/user-profile/${id}`);
});
app.get("/user-logout/:id",(request,response)=>{
    const id=request.params.id;
    const db=dbservices.getDbServiceInstance();
    
    db.isactive(id)
    .then(active=>{
        console.log(active);
        if(active)
        {
            db.logedout(id)
            .catch(err=>{console.log(err," Something wrong with logedout function inside user-logout route")});
            response.redirect(`/home/admin-user.html`);   
        }else{
            response.redirect("/registration-authentication/signin_page.html");
        }
    })
    .catch(err=>console.log("Something wrong with isactive function inside user-logout function"));
});
// app.get("/userlogout/:email",(request,response)=>{
//     const email=request.params.email;
//     const db=dbservices.getDbServiceInstance();
    
//     db.isactive(eamil)
//     .then(active=>{
//         console.log(active);
//         if(active)
//         {
//             db.logedout(id)
//             .catch(err=>{console.log(err," Something wrong with logedout function inside user-logout route")});
//             response.redirect(`/home/admin-user.html`);   
//         }else{
//             response.redirect("/registration-authentication/signin_page.html");
//         }
//     })
//     .catch(err=>console.log("Something wrong with isactive function inside user-logout function"));
// });

app.get("/user-profile/:id",(request,response)=>{
    const id=request.params.id;
    const db=dbservices.getDbServiceInstance();

    db.isactive(id)
    .then(active=>{
        if(active)
        {
            const details=db.userDetails(id)
           .then(data=>{
                var name=data.info.Fname+" "+data.info.Lname;
                response.render("profile_user.hbs",{
                    username:name ,email:data.info.Email,fname:data.info.Fname,lname:data.info.Lname,userid:id
                }); 
            })
            .catch(err=>{
                console.log("Error from user-login ");
                response.status(404).send("Something went wrong!!");
            })   
        }
        else{
            response.redirect("/registration-authentication/signin_page.html");
        }
    })
    .catch(err=>response.status(400).send("Something went wrong!"));
})

app.post("/authenticate",(req,res)=>{

    if(!req.body)
    {
        res.status(400);
        res.send("Error 400!")
    }
    console.log("authenticating  !")
    const db=dbservices.getDbServiceInstance();
    const result=db.authenticate(req.body);
    result
    .then(data=>{
        res.json({data:data});
    })
    .catch(err=>{console.log(err,"error from /insert catch")});
});

var port=process.env.PORT||5000;
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})

