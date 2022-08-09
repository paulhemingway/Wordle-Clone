var answer;
var answerArray = []
let green = 'var(--green)';
let yellow = 'var(--yellow)';

let grey = 'rgb(44,44,44)';

// api url
const api_url = 
      "https://random-word-api.herokuapp.com/word?length=5";
  
// Defining async function
async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    if(response){
        answer = data[0];
        for (var i = 0; i < answer.length; i++){
            answerArray[i] = answer[i]
        }
        console.log(answer);
    }
    

}
// Calling that async function
getapi(api_url);



var current = "a1";

var filled = false;
var win = false;
var focus = document.getElementById(current);

window.addEventListener('keydown', logKey);

function logKey(e){
    if (isLetter(e.key)){     
          inputLetter(e.key);
    }

    if (e.keyCode == 8){        
        inputBackspace();
    }

    if(e.keyCode == 13){
         inputEnter();
    } 
}

function inputLetter(letter){
    if(!filled){
        focus.textContent = letter;
        focus.style.borderWidth = "2px";
        focus.style.animation = "pop 0.1s linear 1"
        
        current = currentForward(current);
        
        focus = document.getElementById(current);

        if(document.getElementById(current[0] + "5").textContent != ""){
            filled = true; 
        }
    }   
}

function inputBackspace(){
    filled = false;
    current = currentBackward(current);
    focus = document.getElementById(current);
    focus.textContent = "";
    focus.style.borderWidth = "1px";        
    focus.style.animation = ""; 
}

function inputEnter(){
    var userWord = ""; 
        var result = []
        if (filled){
            for (var i = 1; i <= 5; i++){
                userWord += document.getElementById(current[0] + i).textContent;
            }
            result = check(userWord);
            flipResult(result, current)

            if(!win){
                current = nextRow(current);
            }
            
            for (var i = 0; i < answer.length; i++){
                answerArray[i] = answer[i]
            }           
            filled = false;
        }
        focus = document.getElementById(current);   
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function nextRow(x){
    filled = false;
    return nextChar(x[0]) + "1";
}

function currentForward(x){
    var newCurrent = "";

        newCurrent += x[0];
        newCurrent += parseInt(x[1]) + 1;
 
    return newCurrent;
}

function currentBackward(x){
    if (x[1] != "1"){
        var newCurrent = "";
        newCurrent += x[0];
        newCurrent += parseInt(x[1]) - 1;
        return newCurrent;
    }
    else{
        return x;
    } 
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function check(userWord){
    var result = []
    var correctCount = 0;
    for (var i = 0; i<5; i++){
        if (answer[i] == userWord[i]){
            result[i] = 2
            changeKeyColor(userWord[i], green)
            correctCount++;
            removeFromAnswerArray(userWord[i])               
        }
    }
    if (correctCount == 5){
        win = true;
    }

    for (var i = 0; i<5; i++){
        if(answerArray.includes(userWord[i])){
            if(answer.includes(userWord[i])){
                result[i] = 1
                changeKeyColor(userWord[i], yellow);
                removeFromAnswerArray(userWord[i])
            } else {
                if (result[i] != 2){
                    result[i] = 0
                }
            }
        } else {
            if (result[i] != 2){
                result[i] = 0
            }
        }
        if (!answer.includes(userWord[i])){
            changeKeyColor(userWord[i], grey)
        }
    }
    return result;
}

function changeKeyColor(letter, color){
    var element = document.getElementById(letter);
    setTimeout(() => {
        if(element.style.background != green){
            element.style.background = color;
        }
    }, 50);
    
        
}

function flipResult(result, current){
    var letter;
    var x = 0;
    var intervalID = setInterval(function () {
        letter = document.getElementById(current[0] + (x+1));
        switch(result[x]){
            case 1:
                letter.style.animation = "spinYellow 0.5s linear 1";
                letter.style.animationFillMode = "forwards";
                break;
            case 2:
                letter.style.animation = "spinGreen 0.5s linear 1";
                letter.style.animationFillMode = "forwards";
                break;
            case 0:
                letter.style.animation = "spin 0.5s linear 1";
                letter.style.animationFillMode = "forwards";
                break;
        }
        x++;
        if (x === 5) {
            window.clearInterval(intervalID);
        }
    }, 200);
}

function removeFromAnswerArray(letter){
    for(var i = 0; i<answerArray.length; i++){
        if (answerArray[i] == letter){
            answerArray.splice(i,1);
        }
    }
}
    
function removeChar(char, tempAnswer){
    var newWord = "";
    var already = false;
    for (var i = 0; i < 5; i++){
        
        if (char == tempAnswer[i]){
            var already = true;
        } 
        if ((char == tempAnswer[i] && already == true) || char != tempAnswer[i]){
            newWord += tempAnswer[i];
        }
    }
    return newWord;
}