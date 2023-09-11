var buttonPause = document.getElementById('bouton-pause');
var buttonPlay = document.getElementById('bouton-play')


const departMinutes = 25;
let temps = departMinutes * 60;
const timerElement = document.getElementById("timer");

window.afficher = function () {
    console.log("hello");
    buttonPause.style.display = (buttonPause.style.display == 'block') ? "none" : "block";
    buttonPlay.style.display = (buttonPlay.style.display == 'none') ? "block" : "none";
}


function startTimer() {
    buttonPlay.onclick = afficher;
    buttonPause.onclick = afficher;

    let minutes = parseInt(temps / 60, 10);
    let secondes = parseInt(temps % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    secondes = secondes < 10 ? "0" + secondes : seconde;


    timerElement.innerText = `${minutes}:${secondes}`
    temps = temps <= 0 ? 0 : temps - 1
    temps--
}


function stopTimer() {
    
}


function resetTime() {

}