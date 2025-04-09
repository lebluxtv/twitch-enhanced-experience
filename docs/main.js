// Initialisation du lecteur Twitch via l'API
const player = new Twitch.Player("twitch-embed", {
  channel: "chaaquey",            // Remplace par le nom de ta chaîne
  parent: ["lebluxtv.github.io"],   // Le domaine autorisé
  controls: false                   // Désactivation des overlays natifs autant que possible
});

// Module de contrôle du volume : utilisation du slider pour régler le volume
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (e) => {
  player.setVolume(parseFloat(e.target.value));
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

  // Début du drag
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    panel.style.zIndex = 1001;
  });

  // Drag en mouvement
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = (e.clientX - offsetX) + 'px';
      panel.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  // Fin du drag et redock (si proche d'un coin)
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      dockToCorner(panel);
    }
  });

  // Fonction de collapse/expand
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
  const containerHeight = playerContainer.offsetHeight;

  // Ajuste la position des panneaux qui doivent se placer en dessous du lecteur (marge de 10px)
  const chatPanel = document.getElementById("chat-panel");
  const subPanel = document.getElementById("sub-panel");

  chatPanel.style.top = (playerContainer.offsetHeight + 10) + "px";
  subPanel.style.top = (playerContainer.offsetHeight + 10) + "px";
}

// Repositionnement au chargement et au redimensionnement de la fenêtre
window.addEventListener('load', repositionPanels);
window.addEventListener('resize', repositionPanels);
