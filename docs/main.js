// Initialisation du lecteur Twitch via l'API
const player = new Twitch.Player("twitch-embed", {
  channel: "dropeart",           // Remplace par ta chaîne en live
  parent: ["lebluxtv.github.io", "localhost"], // Ajouter localhost pour le dev
  controls: false,
  width: "100%",
  height: "100%"
});

// Module de contrôle du volume
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (e) => {
  player.setVolume(parseFloat(e.target.value));
});

// Fonction pour contraindre la position afin que le panneau reste visible
function clampPosition(panel, proposedX, proposedY) {
  // Obtenir la largeur et la hauteur du panneau (en tenant compte du redimensionnement)
  const rect = panel.getBoundingClientRect();
  let x = proposedX;
  let y = proposedY;
  // Limite gauche et haut
  if (x < 0) { x = 0; }
  if (y < 0) { y = 0; }
  // Limite droite et bas selon la fenêtre
  if (x + rect.width > window.innerWidth) {
    x = window.innerWidth - rect.width;
  }
  if (y + rect.height > window.innerHeight) {
    y = window.innerHeight - rect.height;
  }
  return { x, y };
}

// Fonction pour gérer le drag & drop et le collapse pour un panneau donné
function makeDraggable(panel) {
  const header = panel.querySelector('.panel-header');
  const collapseBtn = panel.querySelector('.collapse-btn');
  const content = panel.querySelector('.panel-content');

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    // Calcul de l'offset par rapport à la position du panneau
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    panel.style.zIndex = 1001;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let proposedX = e.clientX - offsetX;
      let proposedY = e.clientY - offsetY;
      // Appliquer le clamp pour que le panneau reste dans la fenêtre
      const { x, y } = clampPosition(panel, proposedX, proposedY);
      panel.style.left = x + 'px';
      panel.style.top  = y + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      // Après le drag, appliquer à nouveau le clamp
      const currentX = parseInt(panel.style.left, 10) || 0;
      const currentY = parseInt(panel.style.top, 10) || 0;
      const { x, y } = clampPosition(panel, currentX, currentY);
      panel.style.left = x + 'px';
      panel.style.top  = y + 'px';
    }
  });

  // Gestion du collapse/expand
  collapseBtn.addEventListener('click', () => {
    const isCollapsed = content.style.display === 'none';
    content.style.display = isCollapsed ? 'block' : 'none';
    collapseBtn.textContent = isCollapsed ? '−' : '+';
  });
}

// Appliquer le drag & drop à tous les panneaux flottants
const panels = document.querySelectorAll('.floating-panel');
panels.forEach(panel => {
  makeDraggable(panel);
});

// Repositionnement global lors du redimensionnement de la fenêtre : 
// Vérifie pour chaque panneau qu'il reste dans la zone visible.
function repositionPanels() {
  panels.forEach(panel => {
    const currentX = parseInt(panel.style.left, 10) || 0;
    const currentY = parseInt(panel.style.top, 10) || 0;
    const { x, y } = clampPosition(panel, currentX, currentY);
    panel.style.left = x + 'px';
    panel.style.top  = y + 'px';
  });
}
window.addEventListener('resize', repositionPanels);
