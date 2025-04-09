document.querySelectorAll('.floating-panel').forEach(panel => {
  const header = panel.querySelector('.panel-header');
  const collapseBtn = panel.querySelector('.collapse-btn');
  const content = panel.querySelector('.panel-content');

  // Drag & move
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    panel.style.zIndex = 100;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = `${Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, e.clientX - offsetX))}px`;
      panel.style.top = `${Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, e.clientY - offsetY))}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.zIndex = 10;
    }
  });

  // Collapse / Expand
  collapseBtn.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    collapseBtn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
  });
});

// (Facultatif) Empêche que les panneaux sortent de l’écran au resize
window.addEventListener('resize', () => {
  document.querySelectorAll('.floating-panel').forEach(panel => {
    const rect = panel.getBoundingClientRect();
    if (rect.right > window.innerWidth) panel.style.left = `${window.innerWidth - panel.offsetWidth}px`;
    if (rect.bottom > window.innerHeight) panel.style.top = `${window.innerHeight - panel.offsetHeight}px`;
  });
});
