// Fecha de inicio de la relación: 21 de abril de 2026.
const relationshipStart = new Date(2026, 3, 21);
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
document.getElementById('daysTogether').textContent = Math.max(0, Math.floor((today - relationshipStart) / 86400000));

const envelope = document.getElementById('openEnvelope');
const hint = document.getElementById('envelopeHint');
const status = document.getElementById('openStatus');
const enterSite = document.getElementById('enterSite');
const musicToggle = document.getElementById('musicToggle');
const music = document.getElementById('backgroundMusic');
let musicPlaying = false;

async function startMusic() {
  try {
    await music.play();
    musicPlaying = true;
    musicToggle.hidden = false;
    musicToggle.textContent = '♫ Pausar música';
    musicToggle.setAttribute('aria-pressed', 'true');
    status.textContent = 'Una melodía hecha para usted, mi amor. ♡';
  } catch (error) {
    status.textContent = 'No se pudo reproducir la música. Verifique que musicamp3/cancion.mp3 sea un archivo MP3 válido.';
    console.error('No se pudo reproducir la música de la página:', error);
  }
}

function stopMusic() {
  music.pause();
  music.currentTime = 0;
  musicPlaying = false;
  musicToggle.textContent = '♫ Reanudar música';
  musicToggle.setAttribute('aria-pressed', 'false');
  status.textContent = 'La melodía está en pausa.';
}

envelope.addEventListener('click', async () => {
  const opened = envelope.classList.toggle('is-open');
  envelope.setAttribute('aria-pressed', String(opened));
  hint.textContent = opened ? 'Una carta escrita solo para usted ♥' : 'Toque el sobre para descubrir su sorpresa ♥';
  if (opened) {
    await startMusic();
  } else {
    stopMusic();
  }
});

enterSite.addEventListener('click', async event => {
  event.preventDefault();
  document.body.classList.add('entered');
  window.location.hash = 'inicio';
  document.getElementById('inicio').scrollIntoView();
  await startMusic();
});

musicToggle.addEventListener('click', async () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicToggle.textContent = '♫ Reanudar música';
    musicToggle.setAttribute('aria-pressed', 'false');
    status.textContent = 'La melodía está en pausa.';
  } else {
    await startMusic();
  }
});

document.querySelectorAll('.messages button').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('messageReveal').textContent = button.dataset.message;
    document.querySelectorAll('.messages button').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
  });
});

const photos = Array.from(document.querySelectorAll('#photoGallery figure'));
const galleryStatus = document.getElementById('galleryStatus');
const autoplayToggle = document.getElementById('toggleGalleryAutoplay');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentPhoto = 0;
let autoplayTimer;
let autoplayEnabled = !prefersReducedMotion.matches;

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  photos.forEach((photo, photoIndex) => {
    photo.hidden = photoIndex !== currentPhoto;
  });
  galleryStatus.textContent = `Foto ${currentPhoto + 1} de ${photos.length}`;
}

document.getElementById('previousPhoto').addEventListener('click', () => {
  showPhoto(currentPhoto - 1);
});

document.getElementById('nextPhoto').addEventListener('click', () => {
  showPhoto(currentPhoto + 1);
});

function updateAutoplay() {
  window.clearInterval(autoplayTimer);
  autoplayToggle.setAttribute('aria-pressed', String(autoplayEnabled));
  autoplayToggle.textContent = autoplayEnabled ? 'Pausar carrusel' : 'Reanudar carrusel';
  if (autoplayEnabled && photos.length > 1) {
    autoplayTimer = window.setInterval(() => showPhoto(currentPhoto + 1), 4500);
  }
}

autoplayToggle.addEventListener('click', () => {
  autoplayEnabled = !autoplayEnabled;
  updateAutoplay();
});

updateAutoplay();
