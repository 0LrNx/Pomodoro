let isRunning = false;
let isWorkTime = true;
let workTime = 0.1 * 60;  // 25 minutes en secondes
let breakTime = 0.2 * 60;  // 5 minutes en secondes
let currentTime = workTime;

var buttonPause = document.getElementById('btn-pause');
var buttonPlay = document.getElementById('btn-play');

var Work = document.getElementById('cyclesWork');
var Break = document.getElementById('cyclesBreak');

function displayButton() {
    buttonPause.style.display = (buttonPause.style.display == 'block') ? "none" : "block";
    buttonPlay.style.display = (buttonPlay.style.display == 'none') ? "block" : "none";
}

function startTimer() {
    buttonPlay.onclick = displayButton;
    buttonPause.onclick = displayButton;
    Work.style.color = "red";
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(updateTimer, 1000);
    }
}

// ...

function updateTimer() {
    currentTime--;
    if (currentTime < 0) {
        if (isWorkTime) {
            isWorkTime = false;
            currentTime = breakTime;
            Work.style.color = "black";
            Break.style.color = "red";

        } else {
            isWorkTime = true;
            currentTime = workTime;
            Work.style.color = "red";
            Break.style.color = "black";
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
