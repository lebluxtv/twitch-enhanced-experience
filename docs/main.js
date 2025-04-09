function makeDraggable(element) {
  let offsetX, offsetY;
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Contraintes pour rester visible
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    element.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    element.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Ajuste si la fenêtre est redimensionnée
  window.addEventListener('resize', () => {
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;
    const left = parseInt(element.style.left || 0, 10);
    const top = parseInt(element.style.top || 0, 10);
    element.style.left = Math.min(left, maxX) + 'px';
    element.style.top = Math.min(top, maxY) + 'px';
  });
}

// Applique à tous les panneaux
['chat-panel', 'sub-panel', 'follower-panel'].forEach(id => {
  const el = document.getElementById(id);
  makeDraggable(el);
});
