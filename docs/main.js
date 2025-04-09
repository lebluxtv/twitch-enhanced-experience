/* main.js */

// Initialisation du lecteur Twitch
const player = new Twitch.Player("twitch-embed", {
  channel: "chaaquey",
  parent: ["lebluxtv.github.io"],
  controls: false // Désactiver overlays natifs (si possible)
});

// Contrôle du volume via un slider externe
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (e) => {
  player.setVolume(parseFloat(e.target.value));
});

// Gestion basique du drag & drop et du collapse
const panels = document.querySelectorAll('.floating-panel');

panels.forEach(panel => {
  const header = panel.querySelector('.panel-header');
  const collapseBtn = panel.querySelector('.collapse-btn');
  const content = panel.querySelector('.panel-content');

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    panel.style.zIndex = 1001;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      dockToCorner(panel);
    }
  });

  collapseBtn.addEventListener('click', () => {
    const isCollapsed = content.style.display === 'none';
    content.style.display = isCollapsed ? 'block' : 'none';
    collapseBtn.textContent = isCollapsed ? '−' : '+';
  });
});

// Fonction de redock
function dockToCorner(panel) {
  const rect = panel.getBoundingClientRect();
  const distance = 50;

  if (rect.top < distance && rect.left < distance) {
    panel.style.top = '10px';
    panel.style.left = '10px';
  } else if (rect.top < distance && window.innerWidth - rect.right < distance) {
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.left = 'unset';
  } else if (window.innerHeight - rect.bottom < distance && rect.left < distance) {
    panel.style.bottom = '10px';
    panel.style.left = '10px';
    panel.style.top = 'unset';
  } else if (window.innerHeight - rect.bottom < distance && window.innerWidth - rect.right < distance) {
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.top = 'unset';
    panel.style.left = 'unset';
  }
}
