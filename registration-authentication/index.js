const register=document.querySelector("#signup-btn");
const signin=document.querySelector("#signin-btn");

if(register)
{
    register.addEventListener("click",()=>{

        const email=document.querySelector("#email_address");
        const username=document.querySelector("#username");
        const firstname=document.querySelector("#firstname");
        const lastname=document.querySelector("#lastname");
        const enrollment=document.querySelector("#enrollment");
        const password=document.querySelector("#password");
        const repassword=document.querySelector("#confirm_password");

       const data={
                        emailvalue:email.value,
                        //usernamevalue:username.value,
                        firstnamevalue:firstname.value,
                        lastnamevalue:lastname.value,
                        enrollmentvalue:enrollment.value,
                        passwordvalue:password.value
       }
       
      const repasswordvalue=repassword.value;
      var message=document.querySelector(".message");  
       if(data.passwordvalue!=repasswordvalue)
       {
        
       // console.log("HEllo");
        message.innerHTML="Password do not match!";
        return ;
       }
      // console.log(data);

       fetch("http://localhost:5000/register",{
           headers:{'content-type':'application/json'},
           method:'POST',
            body:  JSON.stringify(data)
       })
       .then(data=>data.json())
       .then(data=>{
           console.log(data);
          if(data.status)
          {
              message.innerHTML=data.message;
              message.style.color="green";

          }
          else{
            message.innerHTML=data.message;
            message.style.color="red";
          }
       });

    });
}
console.log(signin);
if(signin)
{
    
    signin.addEventListener("click",()=>{

        console.log("Hello from sign in !!");
        const email=document.querySelector("#email-id");
        const password=document.querySelector("#password-id");

     
       const data={
                        emailvalue:email.value,
                        passwordvalue:password.value
       }

       console.log(data);

       fetch("http://localhost:5000/authenticate",{
           headers:{'content-type':'application/json',
                    'Accept': 'application/json'},
           method:'POST',
            body:  JSON.stringify(data)
       })
       .then(data=>data.json()).
       .then(data=>console.log(data.message));
    })
}