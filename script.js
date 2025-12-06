const volumeSlider = document.getElementById("volume");
const muteBtn = document.getElementById("muteBtn");
const overlapToggle = document.getElementById("overlapToggle");

let isMuted = false;
let lastVolume = 1;
let currentAudio = null;
let activeAudios = [];

// Helper to get correct path
function getAudioPath(filename) {
  // Use relative path from current HTML file
  return `${filename}`;
}

// PLAY SOUND BUTTON LOGIC
document.querySelectorAll(".sound-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const soundSrc = getAudioPath(btn.dataset.sound);

    if (!overlapToggle.checked) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      activeAudios = [];
    }

    let audio = new Audio(soundSrc);
    audio.volume = isMuted ? 0 : volumeSlider.value;

    // Play with error handling
    audio.play().catch(err => {
      console.error("Audio failed to play:", soundSrc, err);
    });

    currentAudio = audio;
    activeAudios.push(audio);

    audio.onended = () => {
      activeAudios = activeAudios.filter(a => a !== audio);
    };
  });
});

// LIVE VOLUME CHANGE
volumeSlider.addEventListener("input", () => {
  if (volumeSlider.value > 0 && isMuted) {
    isMuted = false;
    muteBtn.textContent = "🔇 Mute";
  }

  lastVolume = volumeSlider.value;
  activeAudios.forEach(audio => {
    audio.volume = isMuted ? 0 : volumeSlider.value;
  });
});

// MUTE BUTTON
muteBtn.addEventListener("click", () => {
  if (!isMuted) {
    isMuted = true;
    lastVolume = volumeSlider.value;
    volumeSlider.value = 0;
    muteBtn.textContent = "🔊 Unmute";
    activeAudios.forEach(audio => audio.volume = 0);
  } else {
    isMuted = false;
    volumeSlider.value = lastVolume;
    muteBtn.textContent = "🔇 Mute";
    activeAudios.forEach(audio => audio.volume = lastVolume);
  }
});

