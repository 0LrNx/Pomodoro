let isRunning = false;
let isWorkTime = true;
let workTime = 25 * 60;  // 25 minutes en secondes
let breakTime = 5 * 60;  // 5 minutes en secondes
let longBreakTime = 20 * 60;  // 15 minutes en secondes
let currentTime = workTime;


let cpt = 0;
let completedCycles = 0;

var buttonPlay = document.getElementById('btn-play');
var buttonPause = document.getElementById('btn-pause');
var buttonReset = document.getElementById('btn-reset');

var Work = document.getElementById('cyclesWork');
var Break = document.getElementById('cyclesBreak');
var LongBreak = document.getElementById('cyclesLongBreak');
var cycleNumber = document.getElementById('cyclesNumber');

window.onload = function () {
    buttonPause.style.display = "none";
    updateDisplay();

    Break.addEventListener('click', function () {
        currentTime = breakTime;
        isWorkTime = false;
        updateDisplay();
        this.classList.add("active");
        Work.classList.remove("active");
        LongBreak.classList.remove("active");
    });

    Work.addEventListener('click', function () {
        currentTime = workTime;
        isWorkTime = true;
        updateDisplay();
        this.classList.add("active");
        Break.classList.remove("active");
        LongBreak.classList.remove("active");
    });

    LongBreak.addEventListener('click', function () {
        currentTime = longBreakTime;
        isWorkTime = false;
        updateDisplay();
        this.classList.add("active");
        Work.classList.remove("active");
        Break.classList.remove("active");
    });
}

buttonPlay.addEventListener('click', startTimer);
buttonPause.addEventListener('click', pauseTimer);
buttonReset.addEventListener('click', resetTimer);







// TODO LISTENER SUR LES BUTTONS


function startTimer() {
    Work.classList.add("active");
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(updateTimer, 1000);
        buttonPlay.style.display = "none";
        buttonPause.style.display = "block";
    }
}



function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
        buttonPlay.style.display = "block";
        buttonPause.style.display = "none";
    }
}



function updateTimer() {
    currentTime--;
    if (currentTime < 0) {
        if (isWorkTime) {
            isWorkTime = false;
            currentTime = breakTime;
            Work.classList.remove("active");
            Break.classList.add("active");
            LongBreak.classList.remove("active");
        } else {
            isWorkTime = true;
            currentTime = workTime;
            Work.classList.add("active");
            Break.classList.remove("active");
            LongBreak.classList.remove("active");
            cpt++;
            cycleNumber.textContent = `#${cpt}`;

            if (cpt % 4 === 0) {
                isWorkTime = false;
                currentTime = longBreakTime;
                Work.classList.remove("active");
                Break.classList.remove("active");
                LongBreak.classList.add("active");
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
    buttonPause.style.display = "none";
    Work.classList.remove("active");
    Break.classList.remove("active");
    LongBreak.classList.remove("active");

}
