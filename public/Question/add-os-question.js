

document.addEventListener('DOMContentLoaded', function() {
   
    fetch('http://localhost:5000/getAll')
    .then(response=>response.json())
    .then(data=>{ loadHTMLTable(data.data);});
});

document.querySelector('#tbody-id').addEventListener("click",(event)=>{
        if(event.target.className==='delete-row-btn')
        {
          deleteRowbyId(event.target.dataset.id);
        }
        if(event.target.dataset.id=='edit-row-btn')
        {

        }
});

function deleteRowbyId(id)
{
            fetch('http://localhost:5000/delete/'+id,{method:'DELETE'})
           .then(response=>response.json())
           .then(response=>{
            if(response.success)
            {
              //location.reload();
                reloadTable();
            }
            });
}
function reloadTable()
{  
  fetch('http://localhost:5000/getAll')
  .then(response=>response.json())
  .then(data=>{ loadHTMLTable(data.data);});
}
const addbtn=document.querySelector('#button-id');

addbtn.addEventListener('click',()=>{
    
  const question_obj=document.querySelector('#question');
  const option1_obj=document.querySelector('#option1');
  const option2_obj=document.querySelector('#option2');
  const option3_obj=document.querySelector('#option3');
  const option4_obj=document.querySelector('#option4');
  const correct_obj=document.querySelector('#answer');
  
  const question=question_obj.value;
  const option1=option1_obj.value;
  const option2=option2_obj.value;
  const option3=option3_obj.value;
  const option4=option4_obj.value;
  const correct=correct_obj.value;
  
  console.log(question);

  if(question==='')
  {
    alert('Question Field is required.');
    return ;
  }
  if(option1==='')
  {
    alert('Option1 Field is required.');
    return ;
  }
  if(option2==='')
  {
    alert('Option2 Field is required.');
    return ;
  }
  if(option3==='')
  {
    alert('Option3 Field is required.');
    return ;
  }
  if(option4==='')
  {
    alert('Option4 Field is required.');
    return ;
  }
  if(correct==='')
  {
    alert('Answer Field is required.');
    return ;
  }
        //  question_obj.value="";
        //  option1_obj.value="";
        //  option2_obj.value=""; 
        //  option3_obj.value="";
        //  option4_obj.value="";
        //  correct_obj.value="";

  fetch('http://localhost:5000/insert',{
  headers:{'content-type':'application/json'},
  method:'POST',
  body:  JSON.stringify({
      question:question,
      option1:option1,
      option2:option2,
      option3:option3,
      option4:option4,
      correct:correct
  })
  })
  .then(response=>response.json())
  .then(data=>insertRowIntoTable(data.data));
});

function insertRowIntoTable(element)
{
  console.log(element);
  let table=document.querySelector('#tbody-id');
  let isdata=document.querySelector('.no-question');
  let tableRow="";
    
  tableRow+="<tr>"
  tableRow+=`<td>${element.Question}</td>`;
  tableRow+=`<td>${element.Option1}</td>`;
  tableRow+=`<td>${element.Option2}</td>`;
  tableRow+=`<td>${element.Option3}</td>`;
  tableRow+=`<td>${element.Option4}</td>`;
  tableRow+=`<td>${element.Correct}</td>`;
  tableRow+=`<td><button class="delete-row-btn" data-id=${element.Id}>Delete</button></td>`;
  tableRow+=`<td><button class="edit-row-btn" data-id=${element.Id}>Edit</button></td>`;
  tableRow+="</tr>"
    
    if(isdata)
    {
      table.innerHTML=tableRow;
    }
    else{
      const newrow=table.insertRow();
      newrow.innerHTML=tableRow;
    }
}

function loadHTMLTable(data){
  
let table=document.querySelector('#tbody-id');

    if(data.length===0)
    {
      table.innerHTML="<tr><td class='no-question' colspan='8' style='text-align :center;'>No Question Added</td></tr>";
    }
    else{

         let tableRow="";
        data.forEach(element => {
          
          tableRow+="<tr>"
          tableRow+=`<td>${element.Question}</td>`;
          tableRow+=`<td>${element.Option1}</td>`;
          tableRow+=`<td>${element.Option2}</td>`;
          tableRow+=`<td>${element.Option3}</td>`;
          tableRow+=`<td>${element.Option4}</td>`;
          tableRow+=`<td>${element.Correct}</td>`;
          tableRow+=`<td><button class="delete-row-btn" data-id=${element.Id}>Delete</button></td>`;
          tableRow+=`<td><button class="edit-row-btn" data-id=${element.Id}>Edit</button></td>`;
          tableRow+="</tr>"
        });
        table.innerHTML=tableRow;
      };
}