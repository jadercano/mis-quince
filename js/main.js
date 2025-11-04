// === ESTRELLAS ===
function createStars() {
  const container = document.getElementById("starsContainer");
  if (!container) return;
  const num = 120;
  for (let i = 0; i < num; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const delay = Math.random() * 3;
    const duration = 2 + Math.random() * 3;
    star.style.cssText = `
      left:${x}%;
      top:${y}%;
      width:${size}px;
      height:${size}px;
      --delay:${delay}s;
      --duration:${duration}s;
    `;
    container.appendChild(star);
  }
}

// === CONTEO REGRESIVO ===
const eventDate = new Date("2025-12-07T19:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;
  const d = document.getElementById("days");
  const h = document.getElementById("hours");
  const m = document.getElementById("minutes");
  if (!d || !h || !m) return;

  if (distance <= 0) {
    document.querySelector(".countdown-display").innerHTML =
      "<p>¡Hoy es el gran día! 💫</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  d.textContent = String(days).padStart(2, "0");
  h.textContent = String(hours).padStart(2, "0");
  m.textContent = String(minutes).padStart(2, "0");
}

// === AUDIO (versión robusta) ===
function initAudioControls() {
  const song = document.getElementById("song");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const progressBar = document.getElementById("progress");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Validaciones: si no existen elementos, salir sin romper
  if (!song || !playBtn || !playIcon || !progressBar) {
    console.warn("Audio controls: faltan elementos en el DOM.");
    return;
  }

  let isPlaying = false;

  // Evita usar duration antes de cargar metadata
  song.addEventListener("loadedmetadata", () => {
    // si quieres mostrar duración total: song.duration
    // activa controles visuales si estaban desactivados
  });

  function setPlayIcon(playing) {
    playIcon.className = playing ? "fas fa-pause" : "fas fa-play";
  }

  // Play / Pause
  playBtn.addEventListener("click", () => {
    // algunos navegadores requieren interacción del usuario para reproducir audio
    if (song.paused || song.ended) {
      const p = song.play();
      // play() devuelve una promise; manejar errores (autoplay bloqueado)
      if (p && p.catch) {
        p.catch((err) => {
          console.warn("No se pudo reproducir el audio:", err);
        });
      }
      isPlaying = true;
    } else {
      song.pause();
      isPlaying = false;
    }
    setPlayIcon(isPlaying);
  });

  // Actualizar barra de progreso con chequeos (proteger NaN)
  song.addEventListener("timeupdate", () => {
    if (!song.duration || isNaN(song.duration) || !isFinite(song.duration)) {
      progressBar.style.width = "0%";
      return;
    }
    const pct = (song.currentTime / song.duration) * 100;
    progressBar.style.width = pct + "%";
  });

  // Cuando termina la canción
  song.addEventListener("ended", () => {
    isPlaying = false;
    setPlayIcon(false);
    progressBar.style.width = "0%";
  });

  // Click en la barra para hacer seek (busca proporción)
  const progressContainer = progressBar.parentElement; // .progress-bar
  if (progressContainer) {
    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      if (song.duration && isFinite(song.duration)) {
        song.currentTime = pct * song.duration;
      }
    });
  }

  // Prev / Next (placeholder: si no hay playlist, solo reinicia o va al inicio)
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      // si no tienes playlist, retroceder 10s
      song.currentTime = Math.max(0, song.currentTime - 10);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      // si no hay playlist, adelantar 10s
      if (song.duration && isFinite(song.duration)) {
        song.currentTime = Math.min(song.duration, song.currentTime + 10);
      }
    });
  }

  // Teclas: espacio -> play/pause, Esc -> pause
  document.addEventListener("keydown", (e) => {
    // evita interferir al escribir en inputs
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (e.code === "Space") {
      e.preventDefault();
      playBtn.click();
    } else if (e.key === "Escape") {
      song.pause();
      isPlaying = false;
      setPlayIcon(false);
    }
  });
}

// === INICIALIZACIÓN ===
window.addEventListener("load", () => {
  createStars();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initAudioControls();

  // === REVEAL (si lo usas) ===
  const revealElements = document.querySelectorAll("section, header");
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const threshold = 120;
      if (elementTop < windowHeight - threshold) el.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});
