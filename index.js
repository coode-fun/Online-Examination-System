var bnt=document.querySelector("#signin-btn");
bnt.addEventListener("click",()=>{
    console.log("Hello");

    const email=document.querySelector('.email');
    const password=document.querySelector('.password');

    console.log(email.value);
    console.log(password.value);
})