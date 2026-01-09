document.addEventListener("DOMContentLoaded", () => {

    const audio = document.getElementById("bgm");
    const btn = document.getElementById("muteBtn");

    audio.volume = 0.15;
    audio.muted = true;

    function updateIcon() {
        btn.textContent = audio.muted ? "click 4 music :3" : "click 4 silence...";
    }

    btn.addEventListener("click", () => {
        audio.muted = !audio.muted;

        // First user interaction allows playback
        if (!audio.muted && audio.paused) {
            audio.play();
        }

        updateIcon();
    });

    updateIcon();
});