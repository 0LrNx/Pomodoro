let isRunning = false;
let isWorkTime = true;
let workTime = 25 * 60;  // 25 minutes en secondes
let breakTime = 5 * 60;  // 5 minutes en secondes
let longBreakTime = 20 * 60;  // 15 minutes en secondes
let currentTime = workTime;


let cpt = 0;
let completedCycles = 0;

var buttonPlay = document.getElementById('btn-play');
var buttonReset = document.getElementById('btn-reset');

var Work = document.getElementById('cyclesWork');
var Break = document.getElementById('cyclesBreak');
var LongBreak = document.getElementById('cyclesLongBreak');
var cycleNumber = document.getElementById('cyclesNumber');



function displayButton() {
    buttonReset.style.display = (buttonReset.style.display == 'block') ? "none" : "block";
    buttonPlay.style.display = (buttonPlay.style.display == 'none') ? "block" : "none";
}

function startTimer() {
    Work.style.color = "red";
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(updateTimer, 1000);
        buttonPlay.style.display = "none";
        buttonReset.style.display = "block";
    }
}


function updateTimer() {
    currentTime--;
    if (currentTime < 0) {
        if (isWorkTime) {
            isWorkTime = false;
            currentTime = breakTime;
            Work.style.color = "black";
            Break.style.color = "red";
            LongBreak.style.color = "black";
        } else {
            isWorkTime = true;
            currentTime = workTime;
            Work.style.color = "red";
            Break.style.color = "black"
            LongBreak.style.color = "black";
            cpt++;
            cycleNumber.textContent = `#${cpt}`;

            if (cpt % 4 === 0) {
                console.log("hello");
                isWorkTime = false;
                currentTime = longBreakTime;
                Work.style.color = "black";
                Break.style.color = "black";
                LongBreak.style.color = "red";
            }
        }
    }
    updateDisplay();
}


function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    currentTime = workTime;
    updateDisplay();
    buttonPlay.style.display = "block";
    buttonReset.style.display = "none";
    Work.style.color = "red";
    Break.style.color = "black";
    LongBreak.style.color = "black";
}
