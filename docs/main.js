// main.js

// Initialisation du lecteur Twitch via l'API
const player = new Twitch.Player("twitch-embed", {
  channel: "touuclakos",  // Remplace par ta chaîne en live
  parent: ["lebluxtv.github.io", "localhost"],  // Ajuste selon ton environnement
  controls: false,
  width: "100%",
  height: "100%"
});

// Contrôle du volume via le slider
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (e) => {
  player.setVolume(parseFloat(e.target.value));
});

// Fonction pour contraindre la position pour que le panneau reste dans la fenêtre
function clampPosition(panel, proposedX, proposedY) {
  const rect = panel.getBoundingClientRect();
  let x = proposedX;
  let y = proposedY;
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

// Fonction d'auto-docking pour aligner les panneaux en bas si ils se rapprochent du bord
function autoDockPanel(panel) {
  const rect = panel.getBoundingClientRect();
  const threshold = 50; // seuil en pixels
  // Si le bas du panneau est proche du bas de la fenêtre...
  if (window.innerHeight - rect.bottom < threshold) {
    switch (panel.id) {
      case "volume-control":
        panel.style.left = "10px";
        panel.style.bottom = "10px";
        panel.style.top = "";
        break;
      case "follower-panel":
        panel.style.left = "270px"; // 10 + 250 + 10
        panel.style.bottom = "10px";
        panel.style.top = "";
        break;
      case "sub-panel":
        panel.style.left = "530px"; // 10 + 250 + 10 + 250 + 10
        panel.style.bottom = "10px";
        panel.style.top = "";
        break;
      case "chat-panel":
        // En mode normal, on place le chat docké à droite, sauf s'il est en mode full-height.
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

// Fonction pour rendre un panneau déplaçable et gérer le collapse/expand en conservant sa taille
function makeDraggable(panel) {
  const header = panel.querySelector(".panel-header");
  const collapseBtn = panel.querySelector(".collapse-btn");
  const content = panel.querySelector(".panel-content");

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    panel.style.zIndex = 1001;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let proposedX = e.clientX - offsetX;
      let proposedY = e.clientY - offsetY;
      const { x, y } = clampPosition(panel, proposedX, proposedY);
      panel.style.left = x + "px";
      panel.style.top = y + "px";
      // Pour le panneau chat en mode normal, réinitialise la propriété de docking horizontale
      if (panel.id === "chat-panel" && !chatExpanded) {
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

  // Gestion du collapse/expand en conservant la taille actuelle
  collapseBtn.addEventListener("click", () => {
    const isCollapsed = content.style.display === "none";
    if (!isCollapsed) {
      // Avant de cacher le contenu, sauvegarder la hauteur actuelle dans dataset
      if (!panel.dataset.storedHeight) {
        panel.dataset.storedHeight = panel.style.height || panel.offsetHeight + "px";
      }
      content.style.display = "none";
      collapseBtn.textContent = "+";
    } else {
      content.style.display = "block";
      // Restaurer la hauteur sauvegardée afin de conserver la taille agrandie
      if (panel.dataset.storedHeight) {
        panel.style.height = panel.dataset.storedHeight;
        delete panel.dataset.storedHeight;
      }
      collapseBtn.textContent = "−";
    }
  });
}

// Appliquer le comportement de drag & drop et collapse à tous les panneaux flottants
const panels = document.querySelectorAll(".floating-panel");
panels.forEach(panel => {
  makeDraggable(panel);
});

// Variable d'état pour le mode full-height du panneau Chat
let chatExpanded = false;

// Gestion du bouton d'extension du panneau Chat
// Assure-toi d'avoir un bouton avec l'ID "chat-expand-btn" dans l'en-tête du chat.
const chatExpandBtn = document.getElementById("chat-expand-btn");
if (chatExpandBtn) {
  chatExpandBtn.addEventListener("click", () => {
    const chatPanel = document.getElementById("chat-panel");
    const playerContainer = document.getElementById("player-container");
    if (!chatExpanded) {
      // Déployer le chat en full-height sur le côté droit
      chatPanel.classList.add("chat-expanded");
      chatExpandBtn.textContent = "↩";  // Icône pour réduire
      chatExpanded = true;
      // Ajuster le conteneur Twitch pour laisser de la place (marge droite égale à la largeur du chat)
      playerContainer.style.marginRight = "250px";
    } else {
      // Rétablir le mode docké normal pour le chat
      chatPanel.classList.remove("chat-expanded");
      chatExpandBtn.textContent = "⤢";  // Icône pour étendre
      chatExpanded = false;
      chatPanel.style.position = "absolute";
      chatPanel.style.top = "";
      chatPanel.style.right = "10px";
      chatPanel.style.bottom = "10px";
      chatPanel.style.left = "";
      chatPanel.style.height = "";
      playerContainer.style.marginRight = "";
    }
  });
}

// Fonction pour repositionner les panneaux lors du redimensionnement de la fenêtre
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
