/**
 * Initialize variables and set up event listeners when the window loads.
 */

let isRunning = false,
    isWorkTime = true,
    workTime = 25 * 60,
    breakTime = 5 * 60,
    longBreakTime = 20 * 60,
    currentTime = workTime,
    cpt = 1,
    compteur = 0,
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
    audio = new Audio('./audio/stars.mp3'),
    isTimerRunning = false,
    workTimeForm = document.getElementById('work-time'),
    breakTimeForm = document.getElementById('break-time'),
    longBreakTimeForm = document.getElementById('long-break-time'),
    input = [workTimeForm, breakTimeForm, longBreakTimeForm];

window.onload = function () {
    // Hide the pause button initially and mark the "Work" element as active.
    buttonPause.style.display = "none";
    Work.classList.add("active");

    // Check if settings are saved in local storage and update variables accordingly.
    if (localStorage.getItem('workTime')) {
        workTime = parseInt(localStorage.getItem('workTime'));
        breakTime = parseInt(localStorage.getItem('breakTime'));
        longBreakTime = parseInt(localStorage.getItem('longBreakTime'));
        cpt = parseInt(localStorage.getItem('cpt'));
        currentTime = workTime;
        updateDisplay();
    }

    // Event listener for clicking on the "Long Break" button.
    LongBreak.addEventListener('click', function () {
        currentTime = longBreakTime;
        isWorkTime = false;
        isLongBreakTime = true;
        updateDisplay();
        this.classList.add("active");
        Work.classList.remove("active");
        Break.classList.remove("active");
    });

    // Event listener for clicking on the "Work" button.
    Work.addEventListener('click', function () {
        currentTime = workTime;
        isWorkTime = true;
        isLongBreakTime = false;
        updateDisplay();
        this.classList.add("active");
        Break.classList.remove("active");
        LongBreak.classList.remove("active");
    });

    // Event listener for clicking on the "Break" button.
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

// Event listeners for various buttons.
buttonPlay.addEventListener('click', startTimer);
buttonPause.addEventListener('click', pauseTimer);
buttonReset.addEventListener('click', resetTimer);

// Event listener for the settings button.
btnSettings.onclick = function () {
    document.getElementById('work-time').value = workTime / 60;
    document.getElementById('break-time').value = breakTime / 60;
    document.getElementById('long-break-time').value = longBreakTime / 60;
    modal.style.display = "block";
    modal.classList.add("show");
}

// Event listener for the close button in the settings modal.
closeCross.onclick = function () {
    modal.style.display = "none";
    modal.classList.remove("show");
}

// Event listener for the time settings form submission.
timeSettingsForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!isTimerRunning) {
        workTime = parseInt(document.getElementById('work-time').value) * 60;
        breakTime = parseInt(document.getElementById('break-time').value) * 60;
        longBreakTime = parseInt(document.getElementById('long-break-time').value) * 60;
        modal.style.display = "none";

        // Set the current time based on the active phase (Work, Break, or Long Break).
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

/**
 * Start the timer when the "Play" button is clicked.
 */
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isTimerRunning = true;
        timer = setInterval(updateTimer, 1000);
        startProgress();
        buttonPlay.style.display = "none";
        buttonPause.style.display = "block";
        timeSettingsForm.querySelectorAll("input").forEach(function (input) {
            input.disabled = true;
        });
    }
}

/**
 * Pause the timer when the "Pause" button is clicked.
 */
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

/**
 * Update the timer's countdown display.
 */
function updateTimer() {
    currentTime--;
    if (currentTime < 0) {
        compteur++;
        if (compteur % 2 === 0 && compteur % 9 !== 0) {
            isWorkTime = true;
            currentTime = workTime;
            resetElapsedTime();
            Work.classList.add("active");
            Break.classList.remove("active");
            LongBreak.classList.remove("active");
            audio.play();
        } else if (compteur % 9 === 0) {
            isWorkTime = false;
            isLongBreakTime = true;
            currentTime = longBreakTime;
            resetElapsedTime();
            Work.classList.remove("active");
            Break.classList.remove("active");
            LongBreak.classList.add("active");
            audio.play();
        } else {
            isWorkTime = false;
            currentTime = breakTime;
            resetElapsedTime();
            Work.classList.remove("active");
            Break.classList.add("active");
            LongBreak.classList.remove("active");
            audio.play();
        }
        if (compteur % 2 === 0 && compteur % 9 !== 0) {
            cycleNumber.textContent = `cycles: #${cpt}`;
            cpt++;
        }
    }
    updateDisplay();
}

/**
 * Reset the timer when the "Reset" button is clicked.
 */
function resetTimer() {
    location.reload();
    timeSettingsForm.querySelectorAll("input").forEach(function (input) {
        input.disabled = false;
    });
}

/**
 * Update the display of the timer (minutes and seconds).
 */
function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    updateWindowsDisplay(minutes, seconds);
    updateLocalStorage();
}

/**
 * Update the title of the window to reflect the current phase.
 */
function updateWindowsDisplay(minutes, seconds) {
    let phaseName = isLongBreakTime ? 'Long Break' : (isWorkTime ? 'Work' : 'Break');
    document.title = `${phaseName} : ${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}`;
}

// Initialize and start the progress bar.
let progressBarDisplay = document.getElementById('progress-bar-display');

/**
 * Start the progress bar animation.
 */
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
    }, 1000);
}

/**
 * Reset the progress bar.
 */
function resetProgress() {
    clearInterval(interval);
    elapsedTime = 0;
    progress = 0;
    updateProgressBar(progress);
}

/**
 * Update the progress bar's width.
 */
function updateProgressBar(progress) {
    const progressBar = document.querySelector('.determinate');
    progressBar.style.width = `${progress}%`;
}

/**
 * Reset the elapsed time.
 */
function resetElapsedTime() {
    elapsedTime = 0;
}

/**
 * Pause the progress bar animation.
 */
function pauseProgress() {
    clearInterval(interval);
}

/**
 * Update local storage with timer settings and state.
 */
function updateLocalStorage() {
    localStorage.setItem('workTime', workTime);
    localStorage.setItem('breakTime', breakTime);
    localStorage.setItem('longBreakTime', longBreakTime);
    localStorage.setItem('isWorkTime', isWorkTime);
    localStorage.setItem('isLongBreakTime', isLongBreakTime);
    localStorage.setItem('cpt', cpt);
}

// Event listener to reset local storage data.
var resetStorageButton = document.getElementById('resetStorage');
resetStorageButton.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});

// Event listeners for audio settings.
var audioToggle = document.getElementById('audio-toggle');
let volumeSlider = document.getElementById('volume-slider');
let volumePercentage = document.getElementById('volume-percentage');

// Update audio volume based on the slider.
volumeSlider.addEventListener('input', function () {
    let volumeValue = volumeSlider.value * 100;
    volumePercentage.textContent = volumeValue.toFixed(0) + '%';
    audio.volume = volumeSlider.value;
});


// Initialize audio volume and update the display.
audio.volume = volumeSlider.value;
volumePercentage.textContent = (volumeSlider.value * 100).toFixed(0) + '%';


// Event listener to toggle audio mute.
audioToggle.addEventListener('change', function () {
    if (this.checked) {
        audio.muted = true;
    } else {
        audio.muted = false;
    }
});


// Event listeners to validate input fields in the settings modal.
for (let resultat of input) {
    resultat.addEventListener('input', function () {
        let valeur = this.value.match(/^\d+$/);
        if (valeur === null) {
            this.value = "";
        } else if (valeur == 0) {
            this.value = "";
        }
        if( valeur > 60){
            this.value = "";
        }
    });
}