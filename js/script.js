let isRunning = false,
    isWorkTime = true,
    workTime = 25 * 60,
    breakTime = 5 * 60,
    longBreakTime = 20 * 60,
    currentTime = workTime,
    cpt = 0,
    completedCycles = 0,
    isLongBreakTime = false,
    buttonPlay = document.getElementById('btn-play'),
    buttonPause = document.getElementById('btn-pause'),
    buttonReset = document.getElementById('btn-reset'),
    Work = document.getElementById('cyclesWork'),
    Break = document.getElementById('cyclesBreak'),
    LongBreak = document.getElementById('cyclesLongBreak'),
    cycleNumber = document.getElementById('cyclesNumber'),
    timeSettingsForm = document.getElementById('time-settings'),
    textModification = document.getElementById('text-modification'),
    modal = document.getElementById("myModal"),
    btnSettings = document.getElementById("btn-settings"),
    closeCross = document.getElementsByClassName("close")[0],
    progress = 0,
    interval,
    elapsedTime = 0,
    phaseDuration,
    audio = new Audio('/assets/audio/stars.mp3'),
    isTimerRunning = false,
    workTimeForm = document.getElementById('work-time'),
    breakTimeForm = document.getElementById('break-time'),
    longBreakTimeForm = document.getElementById('long-break-time'),
    input = [workTimeForm, breakTimeForm, longBreakTimeForm];

window.onload = function () {
    buttonPause.style.display = "none";
    Work.classList.add("active");

    if (localStorage.getItem('workTime')) {
        workTime = parseInt(localStorage.getItem('workTime'));
        breakTime = parseInt(localStorage.getItem('breakTime'));
        longBreakTime = parseInt(localStorage.getItem('longBreakTime'));
        cpt = parseInt(localStorage.getItem('cpt'));
        currentTime = workTime;
        updateDisplay();
    }

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

btnSettings.onclick = function () {
    document.getElementById('work-time').value = workTime / 60;
    document.getElementById('break-time').value = breakTime / 60;
    document.getElementById('long-break-time').value = longBreakTime / 60;
    modal.style.display = "block";
    modal.classList.add("show");
}

closeCross.onclick = function () {
    modal.style.display = "none";
    modal.classList.remove("show");
}

timeSettingsForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!isTimerRunning) {
        workTime = parseInt(document.getElementById('work-time').value) * 60;
        breakTime = parseInt(document.getElementById('break-time').value) * 60;
        longBreakTime = parseInt(document.getElementById('long-break-time').value) * 60;
        modal.style.display = "none";

        if (isWorkTime) {
            currentTime = workTime;
        } else if (isLongBreakTime) {
            currentTime = longBreakTime;
        } else {
            currentTime = breakTime;
        }

        updateDisplay();
        updateLocalStorage();
    }
});

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isTimerRunning = true;
        timer = setInterval(updateTimer, 100);
        startProgress();
        buttonPlay.style.display = "none";
        buttonPause.style.display = "block";
        timeSettingsForm.querySelectorAll("input").forEach(function (input) {
            input.disabled = true;
        });
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        isTimerRunning = false;
        clearInterval(timer);
        clearInterval(interval);
        pauseProgress();
        buttonPlay.style.display = "block";
        buttonPause.style.display = "none";
        timeSettingsForm.querySelectorAll("input").forEach(function (input) {
            input.disabled = true;
        });
    }
}

function updateTimer() {
    currentTime--;
    if (currentTime < 0) {
        if (isWorkTime) {
            isWorkTime = false;
            currentTime = breakTime;
            resetElapsedTime();
            Work.classList.remove("active");
            Break.classList.add("active");
            LongBreak.classList.remove("active");
            audio.play();
        } else {
            isWorkTime = true;
            currentTime = workTime;
            resetElapsedTime();
            Work.classList.add("active");
            Break.classList.remove("active");
            LongBreak.classList.remove("active");
            cycleNumber.textContent = `cycles : #${cpt}`;
            cpt++;
            audio.play();
            if (cpt % 4 === 0) {
                isWorkTime = false;
                isLongBreakTime = true;
                currentTime = longBreakTime;
                resetElapsedTime();
                Work.classList.remove("active");
                Break.classList.remove("active");
                LongBreak.classList.add("active");
                audio.play();
            }
        }
    }
    updateDisplay();
}

function resetTimer() {
    localStorage.removeItem('cpt');
    location.reload();
    timeSettingsForm.querySelectorAll("input").forEach(function (input) {
        input.disabled = false;
    });
}

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    updateWindowsDisplay(minutes, seconds);
    updateLocalStorage();
}

function updateWindowsDisplay(minutes, seconds) {
    let phaseName = isLongBreakTime ? 'Long Break' : (isWorkTime ? 'Work' : 'Break');
    document.title = `POMODORO-${phaseName} : ${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}`;
}

let progressBarDisplay = document.getElementById('progress-bar-display');

function startProgress() {
    interval = setInterval(() => {
        phaseDuration = isWorkTime ? workTime : (isLongBreakTime ? longBreakTime : breakTime);
        if (elapsedTime < phaseDuration) {
            progress = (elapsedTime / phaseDuration) * 100;
            updateProgressBar(progress);
            elapsedTime++;
        } else {
            progress = 0;
            updateProgressBar(progress);
        }
    }, 100);
}

function resetProgress() {
    clearInterval(interval);
    elapsedTime = 0;
    progress = 0;
    updateProgressBar(progress);
}

function updateProgressBar(progress) {
    const progressBar = document.querySelector('.determinate');
    progressBar.style.width = `${progress}%`;
}

function resetElapsedTime() {
    elapsedTime = 0;
}

function pauseProgress() {
    clearInterval(interval);
}

function updateLocalStorage() {
    localStorage.setItem('workTime', workTime);
    localStorage.setItem('breakTime', breakTime);
    localStorage.setItem('longBreakTime', longBreakTime);
    localStorage.setItem('isWorkTime', isWorkTime);
    localStorage.setItem('isLongBreakTime', isLongBreakTime);
    localStorage.setItem('cpt', cpt);
}

var resetStorageButton = document.getElementById('resetStorage');

resetStorageButton.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});

var audioToggle = document.getElementById('audio-toggle');
let volumeSlider = document.getElementById('volume-slider');
let volumePercentage = document.getElementById('volume-percentage');

volumeSlider.addEventListener('input', function () {
    let volumeValue = volumeSlider.value * 100;
    volumePercentage.textContent = volumeValue.toFixed(0) + '%';
    audio.volume = volumeSlider.value;
});

audio.volume = volumeSlider.value;
volumePercentage.textContent = (volumeSlider.value * 100).toFixed(0) + '%';

audioToggle.addEventListener('change', function () {
    if (this.checked) {
        audio.muted = true;
    } else {
        audio.muted = false;
    }
});


for (let resultat of input) {
    resultat.addEventListener('input', function () {
        let valeur = this.value.match(/^\d+$/);
        if (valeur === null) {
            this.value = "";
        } else if (valeur == 0) {
            this.value = "";
        }
    });
}
