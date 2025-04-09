// Initialisation du lecteur Twitch via l'API
const player = new Twitch.Player("twitch-embed", {
  channel: "dropeart",  // Remplace par ta chaîne en live
  parent: ["lebluxtv.github.io", "localhost"],  // Ajuste selon ton environnement
  controls: false,
  width: "100%",
  height: "100%"
});

// Contrôle du volume via le slider
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", e => {
  player.setVolume(parseFloat(e.target.value));
});

// Fonction pour contraindre la position afin que le panneau reste visible
function clampPosition(panel, proposedX, proposedY) {
  const rect = panel.getBoundingClientRect();
  let x = proposedX, y = proposedY;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + rect.width > window.innerWidth) {
    x = window.innerWidth - rect.width;
  }
  if (y + rect.height > window.innerHeight) {
    y = window.innerHeight - rect.height;
  }
  return { x, y };
}

// Fonction d'auto-docking selon le panel et le seuil de proximité avec le bas de la fenêtre
function autoDockPanel(panel) {
  const rect = panel.getBoundingClientRect();
  const threshold = 50;
  // Si le bas du panneau est proche du bas de la fenêtre
  if (window.innerHeight - rect.bottom < threshold) {
    switch(panel.id) {
      case "volume-control":
        panel.style.left = "10px";
        panel.style.bottom = "10px";
        panel.style.top = "";
        break;
      case "follower-panel":
        panel.style.left = "270px";
        panel.style.bottom = "10px";
        panel.style.top = "";
        break;
      case "sub-panel":
        panel.style.left = "530px";
        panel.style.bottom = "10px";
        panel.style.top = "";
        break;
      case "chat-panel":
        if (!chatExpanded) {
          panel.style.right = "10px";
          panel.style.bottom = "10px";
          panel.style.top = "";
          panel.style.left = "";
        }
        break;
    }
  }
}

// Fonction pour rendre un panneau déplaçable et gérant le collapse
function makeDraggable(panel) {
  const header = panel.querySelector(".panel-header");
  const collapseBtn = panel.querySelector(".collapse-btn");
  let isDragging = false, offsetX = 0, offsetY = 0;

  header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    panel.style.zIndex = 1001;
  });
  document.addEventListener("mousemove", e => {
    if (isDragging) {
      let proposedX = e.clientX - offsetX;
      let proposedY = e.clientY - offsetY;
      const { x, y } = clampPosition(panel, proposedX, proposedY);
      panel.style.left = x + "px";
      panel.style.top = y + "px";
      // Pour le panneau Chat en mode normal, on réinitialise les propriétés de docking horizontales
      if(panel.id === "chat-panel" && !chatExpanded) {
        panel.style.right = "";
      }
    }
  });
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      autoDockPanel(panel);
    }
  });

  // Gérer le collapse/expand simple (pour les panneaux autres que le chat full-height)
  collapseBtn.addEventListener("click", () => {
    const content = panel.querySelector(".panel-content");
    const isCollapsed = content.style.display === "none";
    content.style.display = isCollapsed ? "block" : "none";
    collapseBtn.textContent = isCollapsed ? "−" : "+";
  });
}

// Appliquer le comportement de drag & drop à tous les panneaux flottants
const panels = document.querySelectorAll(".floating-panel");
panels.forEach(panel => {
  makeDraggable(panel);
});

// Variable d'état pour le mode full-height du chat
let chatExpanded = false;

// Gestion du bouton d'extension du chat
const chatExpandBtn = document.getElementById("chat-expand-btn");
chatExpandBtn.addEventListener("click", () => {
  const chatPanel = document.getElementById("chat-panel");
  const playerContainer = document.getElementById("player-container");
  if (!chatExpanded) {
    // Déployer le chat en full-height sur le côté droit
    chatPanel.classList.add("chat-expanded");
    chatExpandBtn.textContent = "↩";  // icône pour réduire
    chatExpanded = true;
    // Ajuster le conteneur Twitch pour laisser de la place (par ex., une marge droite égale à la largeur du chat)
    playerContainer.style.marginRight = "250px";
  } else {
    // Rétablir le chat en mode docké normal
    chatPanel.classList.remove("chat-expanded");
    chatExpandBtn.textContent = "⤢";  // icône pour étendre
    chatExpanded = false;
    // Rétablir la position dockée du chat
    chatPanel.style.position = "absolute";
    chatPanel.style.top = "";
    chatPanel.style.right = "10px";
    chatPanel.style.bottom = "10px";
    chatPanel.style.left = "";
    chatPanel.style.height = "";
    playerContainer.style.marginRight = "";
  }
});

// Repositionner tous les panneaux si la fenêtre est redimensionnée (et les "clamp")
function repositionPanels() {
  panels.forEach(panel => {
    const currentX = parseInt(panel.style.left, 10) || 0;
    const currentY = parseInt(panel.style.top, 10) || 0;
    const { x, y } = clampPosition(panel, currentX, currentY);
    panel.style.left = x + "px";
    panel.style.top = y + "px";
    autoDockPanel(panel);
  });
}
window.addEventListener("resize", repositionPanels);
