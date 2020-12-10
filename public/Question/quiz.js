
//STARTING POINT //
//Array of Objects


const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const optionContainer = document.querySelector(".option-container");
const answerIndicatorContainer = document.querySelector(".answers-indicator"); 
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");


let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswer = 0;
let attempt = 0;

var quiz ;
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response=>response.json())
    .then(data=>{ createArray(data.data);});
});

function createArray(data)
{
    //console.log("Hello from question side. : "+ data);
    var temp=[];
    data.forEach(element => {
        var obj={
            q:element.Question,
            options:[element.Option1,element.Option2,element.Option3,element.Option4],
            answer:element.Correct
        }
        temp.push(obj);
    });
    quiz=temp;
    homeBox.querySelector(".total-question").innerHTML = quiz.length;
}

// push the questions into availableQuestions Array
function setAvailableQuestion(){
    const totalQuestion = quiz.length;
    console.log(totalQuestion);
    for(let i=0; i<totalQuestion;i++){
        availableQuestions.push(quiz[i]);
    }

}

//set question number and question and options
function getNewQuestion(){
    //set question number
    questionNumber.innerHTML = "Question " + (questionCounter + 1) + " of " + quiz.length;

    //set question text
    //get random question
    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentQuestion = questionIndex;
    questionText.innerHTML = currentQuestion.q;
    //get the position of 'questionIndex' from the availableQuestion array
    const index1 = availableQuestions.indexOf(questionIndex);
    //remove the 'questionINdex' from the availableQuestion array, so that the question does not come again
    availableQuestions.splice(index1, 1);

    //set options
    //get the length of options
    const optionLength = currentQuestion.options.length;
    //push options into availableOptions array
    for(let i=0; i<optionLength;i++){
        availableOptions.push(i);
    }
    optionContainer.innerHTML = '';
    let animationDelay = 0.15;

    //create options in innerHTML
    for(let i=0;i<optionLength;i++){
        //random option
        const optionIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        //get the position of 'optionIndex' from the availableOptions array
        const index2 = availableOptions.indexOf(optionIndex);
        //remove the 'optionIndex' from the availableOptions array, so that the option does not repeat
        availableOptions.splice(index2, 1);
        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[optionIndex];
        option.id = optionIndex;
        option.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay+ 0.15;
        option.className = "option";
        optionContainer.appendChild(option);
        option.setAttribute("onclick", "getResult(this)");
    }
    
    questionCounter++;

}

//get the result of current attempt question
function getResult(element){
    const id = parseInt(element.id);
    
    //get the answer by comparing the id of the clicked option
    if(id === currentQuestion.answer){
        //set the green color to the correct option
        element.classList.add("correct");
        //add the indicator to correct option
        updateAnswerIndicator("correct");
        correctAnswer++;
    }
    else{
        //set the red color to the incorrect option
        element.classList.add("wrong");
        //add the indicator to incorrect option
        updateAnswerIndicator("wrong");
        //if the answer is incorrect then show the correct option by grenn color to the correct option
        const optionLength = optionContainer.children.length;
        for(let i=0;i<optionLength; i++){
            if(parseInt(optionContainer.children[i].id) === currentQuestion.answer){
                optionContainer.children[i].classList.add("correct");
            }
        }
    }
    attempt++;
    unclickableOptions();
}

//make alll the options unclickable once the user select a option(RESTRICT the user to change the option)
function unclickableOptions(){
    const optionLength = optionContainer.children.length;
    for(let i=0;i<optionLength;i++){
        optionContainer.children[i].classList.add("already-answered");
    }
}

function answerIndicator(){
    answerIndicatorContainer.innerHTML = '';
    const totalQuestion = quiz.length;
    for(let i=0;i<totalQuestion;i++){
        const indicator = document.createElement("div");
        answerIndicatorContainer.appendChild(indicator);
    }
}

function next(){
    if(questionCounter === quiz.length){
        //console.log("Quiz Over");
        quizOver();
    }
    else{
        getNewQuestion();
    }
}

function quizOver(){
    //hide quiz box 
    quizBox.classList.add("hide");
    //show result box
    resultBox.classList.remove("hide");
    quizResult();
}
//get the result of the quiz
function quizResult(){
    resultBox.querySelector(".total-question").innerHTML= quiz.length;
    resultBox.querySelector(".total-attempt").innerHTML= attempt;
    resultBox.querySelector(".total-correct").innerHTML= correctAnswer;
    resultBox.querySelector(".total-wrong").innerHTML= attempt-correctAnswer;
    const percentage = (correctAnswer/quiz.length)*100;
    resultBox.querySelector(".percentage").innerHTML= percentage.toFixed(2) + "%";
    resultBox.querySelector(".total-score").innerHTML= correctAnswer + " / " + quiz.length;
}

function updateAnswerIndicator(markType){
    answerIndicatorContainer.children[questionCounter-1].classList.add(markType);
}

function resetQuiz(){
    questionCounter = 0;
    correctAnswer = 0;
    attempt = 0;
}
function tryAgainQuiz(){
    //hide the result box
    resultBox.classList.add("hide");
    //show thw quiz box
    quizBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}

function backToHome(){
    //hide result Box
    resultBox.classList.add("hide");
    // show home box
    homeBox.classList.remove("hide");
    resetQuiz();
}

// STARTING POINT //
function startQuiz(){
    //hide home box 
    homeBox.classList.add("hide");
    //show quiz box
    quizBox.classList.remove("hide");

    //first we'll set all questions in availableQuestions array
    setAvailableQuestion();
    //second we'll call getNewQuestion() function
    getNewQuestion();
    //to create indicator of answers
    answerIndicator();
}

// window.onload = function() {
//     console.log(quiz);
//     homeBox.querySelector(".total-question").innerHTML = quiz.length;
// }