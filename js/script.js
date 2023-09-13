let isRunning = false;
let isWorkTime = true;
let workTime = 25 * 60;  // 25 minutes en secondes
let breakTime = 5 * 60;  // 5 minutes en secondes
let longBreakTime = 20 * 60;  // 15 minutes en secondes
let currentTime = workTime;


let cpt = 0;
let completedCycles = 0;
let isLongBreakTime = false;

var buttonPlay = document.getElementById('btn-play');
var buttonPause = document.getElementById('btn-pause');
var buttonReset = document.getElementById('btn-reset');

var Work = document.getElementById('cyclesWork');
var Break = document.getElementById('cyclesBreak');
var LongBreak = document.getElementById('cyclesLongBreak');
var cycleNumber = document.getElementById('cyclesNumber');

var timeSettingsForm = document.getElementById('time-settings');

var modal = document.getElementById("myModal");
var btn = document.getElementById("btn-settings");
var span = document.getElementsByClassName("close")[0];


window.onload = function () {
    buttonPause.style.display = "none";
    Work.classList.add("active");
    updateDisplay();

    LongBreak.addEventListener('click', function () {
        currentTime = longBreakTime;
        isWorkTime = false;
        isLongBreakTime = true;
        updateDisplay();
        this.classList.add("active");
        Work.classList.remove("active");
        Break.classList.remove("active");
    });

    Work.addEventListener('click', function () {
        currentTime = workTime;
        isWorkTime = true;
        isLongBreakTime = false;
        updateDisplay();
        this.classList.add("active");
        Break.classList.remove("active");
        LongBreak.classList.remove("active");
    });

    Break.addEventListener('click', function () {
        currentTime = breakTime;
        isWorkTime = false;
        isLongBreakTime = false;
        updateDisplay();
        this.classList.add("active");
        Work.classList.remove("active");
        LongBreak.classList.remove("active");
    });
}

buttonPlay.addEventListener('click', startTimer);
buttonPause.addEventListener('click', pauseTimer);
buttonReset.addEventListener('click', resetTimer);


btn.onclick = function () {
    document.getElementById('work-time').value = workTime / 60;
    document.getElementById('break-time').value = breakTime / 60;
    document.getElementById('long-break-time').value = longBreakTime / 60;
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



timeSettingsForm.addEventListener('submit', function (event) {
    event.preventDefault();
    workTime = parseInt(document.getElementById('work-time').value) * 60;
    breakTime = parseInt(document.getElementById('break-time').value) * 60;
    longBreakTime = parseInt(document.getElementById('long-break-time').value) * 60;
    if (isWorkTime) {
        currentTime = workTime;
    } else {
        currentTime = breakTime;
    }
    modal.style.display = "none";
    updateDisplay();
});




function startTimer() {
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
            cycleNumber.textContent = `cycles #${cpt}`;

            if (cpt % 4 === 0) {
                isWorkTime = false;
                isLongBreakTime = true;
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
    updateWindowsDisplay(minutes, seconds);
}


function updateWindowsDisplay(minutes, seconds) {
    let phaseName = isLongBreakTime ? 'LongBreak' : (isWorkTime ? 'Work' : 'Break');
    document.title = `POMODORO-${phaseName} : ${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}`;
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
