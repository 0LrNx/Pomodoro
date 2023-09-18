
/* ========== INITIALISATION =========*/

let isRunning = false;
let isWorkTime = true;
let workTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 20 * 60;
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
var textModification = document.getElementById('text-modification');

var modal = document.getElementById("myModal");
var btnSettings = document.getElementById("btn-settings");
var closeCross = document.getElementsByClassName("close")[0];



let progress = 0;
let interval;


let elapsedTime = 0;
let phaseDuration;

let audio = new Audio('/assets/audio/stars.mp3');

let isTimerRunning = false;

var workTimeForm = document.getElementById('work-time');
var breakTimeForm = document.getElementById('break-time');
var longBreakTimeForm = document.getElementById('long-break-time');

const input = [workTimeForm, breakTimeForm, longBreakTimeForm];


/* ========== CHARGEMENT DE LA PAGE =========*/

window.onload = function () {
    buttonPause.style.display = "none";
    Work.classList.add("active");

    if (localStorage.getItem('workTime')) {
        workTime = parseInt(localStorage.getItem('workTime'));
        breakTime = parseInt(localStorage.getItem('breakTime'));
        longBreakTime = parseInt(localStorage.getItem('longBreakTime'));
        isWorkTime = JSON.parse(localStorage.getItem('isWorkTime'));
        isLongBreakTime = JSON.parse(localStorage.getItem('isLongBreakTime'));
        cpt = parseInt(localStorage.getItem('cpt'));

        currentTime = workTime;
        // if (!isWorkTime && !isLongBreakTime) {
        //     currentTime = breakTime;
        // } else if (isLongBreakTime) {
        //     currentTime = longBreakTime;
        // } else {
        //     currentTime = workTime;
        // }
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

/* ========== BUTTON LISTENER  =========*/

buttonPlay.addEventListener('click', startTimer);
buttonPause.addEventListener('click', pauseTimer);
buttonReset.addEventListener('click', resetTimer);

/* ========== WINDOW MODAL  =========*/

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

/* ========== TIMER GESTION =========*/

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
            cpt++;
            cycleNumber.textContent = `cycles : #${cpt}`;
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
    {/*clearInterval(timer);
    isRunning = false;
    isTimerRunning = false;
    currentTime = workTime;
    isWorkTime = true;
    isLongBreakTime = false;
    updateDisplay();
    resetProgress();
    buttonPlay.style.display = "block";
    buttonPause.style.display = "none";
    Work.classList.add("active");
    Break.classList.remove("active");
    LongBreak.classList.remove("active");
    updateLocalStorage();
cpt = 0;*/}
    location.reload();
    cycleNumber.textContent = `cycles : #${cpt}`;
    timeSettingsForm.querySelectorAll("input").forEach(function (input) {
        input.disabled = false;
    });
}

/* ========== DISPLAY TIMER GESTION =========*/

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    updateWindowsDisplay(minutes, seconds);
    updateLocalStorage();
}

/* ========== DISPLAY TIMER & CYCLES IN WINDOWS =========*/

function updateWindowsDisplay(minutes, seconds) {
    let phaseName = isLongBreakTime ? 'LongBreak' : (isWorkTime ? 'Work' : 'Break');
    document.title = `POMODORO-${phaseName} : ${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}`;
}


/* ========== PROGRESS BAR =========*/

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
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progress}%`;
}

function resetElapsedTime() {
    elapsedTime = 0;
}

function pauseProgress() {
    clearInterval(interval);
}


/* ========== LOCAL STORAGE =========*/

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


/* ========== AUDIO ========== */

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
        audio.muted = false;
    } else {
        audio.muted = true;
    }
});


/* ========== FORM VALIDATION ========== */


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



document.addEventListener("DOMContentLoaded", function () {
    // Récupérez les éléments des boutons et des contenus
    var timerSettingsTab = document.getElementById("timer-settings-tab");
    var soundSettingsTab = document.getElementById("sound-settings-tab");
    var timerSettingsContent = document.getElementById("timer-settings-content");
    var soundSettingsContent = document.getElementById("sound-settings-content");

    // Définissez les gestionnaires d'événements pour les boutons
    timerSettingsTab.addEventListener("click", function () {
        // Affichez le contenu des paramètres du timer et masquez le contenu des paramètres du son
        timerSettingsContent.style.display = "block";
        soundSettingsContent.style.display = "none";

        // Ajoutez ou supprimez la classe "active" pour styliser l'onglet actif
        timerSettingsTab.classList.add("active");
        soundSettingsTab.classList.remove("active");
    });

    soundSettingsTab.addEventListener("click", function () {
        // Affichez le contenu des paramètres du son et masquez le contenu des paramètres du timer
        soundSettingsContent.style.display = "block";
        timerSettingsContent.style.display = "none";

        // Ajoutez ou supprimez la classe "active" pour styliser l'onglet actif
        soundSettingsTab.classList.add("active");
        timerSettingsTab.classList.remove("active");
    });

    // Définissez l'onglet "Timer Settings" comme actif par défaut
    timerSettingsTab.click();
});

