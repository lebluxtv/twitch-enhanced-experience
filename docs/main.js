/* 
  main.js
  - Initialise le lecteur Twitch via l'API et tente de désactiver les contrôles natifs.
  - Met en place le module de contrôle de volume.
  - Gère également le drag & drop et les fonctionnalités de collapse pour les panneaux.
*/

// Initialisation du lecteur Twitch
const player = new Twitch.Player("twitch-embed", {
  channel: "touuclakos",
  parent: ["lebluxtv.github.io"],
  // Tentative de désactivation des overlays natifs
  controls: false
});

// Configuration du module de contrôle de volume
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (e) => {
  const volume = parseFloat(e.target.value);
  player.setVolume(volume);
});

// Gestion des panneaux flottants (drag & drop et collapse)
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
      // Optionnel : Redocker le panneau s'il est proche d'un coin
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

// Ajustement des positions des panneaux lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  panels.forEach(p => {
    const rect = p.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      p.style.left = `${window.innerWidth - rect.width - 10}px`;
    }
    if (rect.bottom > window.innerHeight) {
      p.style.top = `${window.innerHeight - rect.height - 10}px`;
    }
  });
});
