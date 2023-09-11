var buttonPause = document.getElementById('bouton-pause');
var buttonPlay = document.getElementById('bouton-play')

window.afficher = function () {
    console.log("hello");
    buttonPause.style.display = (buttonPause.style.display == 'block') ? "none" : "block";
    buttonPlay.style.display = (buttonPlay.style.display == 'none') ? "block" : "none";
}


function startTimer() {
    buttonPlay.onclick = afficher;
    buttonPause.onclick = afficher;
}

