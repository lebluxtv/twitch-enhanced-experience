// main.js

// Initialisation du lecteur Twitch via l'API
const player = new Twitch.Player("twitch-embed", {
  channel: "touuclakos",
  parent: ["lebluxtv.github.io"],
  // On désactive les overlays natifs autant que possible
  controls: false
});

// Module de contrôle du volume
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (e) => {
  const volume = parseFloat(e.target.value);
  player.setVolume(volume);
});

// Gestion du drag & drop et du collapse pour les panneaux flottants
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
      // Optionnel : redocker le panneau s'il est proche d'un coin
      dockToCorner(panel);
    }
  });

  collapseBtn.addEventListener('click', () => {
    const isCollapsed = content.style.display === 'none';
    content.style.display = isCollapsed ? 'block' : 'none';
    collapseBtn.textContent = isCollapsed ? '−' : '+';
  });
});

// Fonction de redock : aligne le panneau s'il est proche d'un coin
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

// Repositionnement des panneaux en fonction de la hauteur du lecteur
function repositionPanels() {
  const playerContainer = document.getElementById("player-container");
  const playerHeight = playerContainer.offsetHeight;
  
  // Place les panneaux juste en dessous du lecteur (avec une marge de 10px)
  const chatPanel = document.getElementById("chat-panel");
  const subPanel = document.getElementById("sub-panel");
  
  chatPanel.style.top = (playerHeight + 10) + "px";
  subPanel.style.top = (playerHeight + 10) + "px";
}

// Appeler le repositionnement lors du chargement et redimensionnement
window.addEventListener('load', repositionPanels);
window.addEventListener('resize', repositionPanels);
