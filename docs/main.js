// Rendre les panneaux flottants déplaçables + dockables
const floatingPanels = document.querySelectorAll('.floating-panel');

floatingPanels.forEach(panel => {
  makeDraggable(panel);
});

const docks = {
  'dock-tl': { top: '10px', left: '10px' },
  'dock-tr': { top: '10px', right: '10px' },
  'dock-bl': { bottom: '10px', left: '10px' },
  'dock-br': { bottom: '10px', right: '10px' }
};

function makeDraggable(element) {
  let offsetX, offsetY;
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.zIndex = 1000;

    // Convertir les positions absolues en styles inline (top/left)
    element.style.top = element.offsetTop + 'px';
    element.style.left = element.offsetLeft + 'px';
    element.style.bottom = '';
    element.style.right = '';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    element.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    element.style.top = Math.max(0, Math.min(y, maxY)) + 'px';

    // Highlight les zones de dock si on passe dessus
    for (let dockId in docks) {
      const zone = document.getElementById(dockId);
      const rect = zone.getBoundingClientRect();
      if (
        e.clientX > rect.left &&
        e.clientX < rect.right &&
        e.clientY > rect.top &&
        e.clientY < rect.bottom
      ) {
        zone.classList.add('active');
      } else {
        zone.classList.remove('active');
      }
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;

    for (let dockId in docks) {
      const zone = document.getElementById(dockId);
      const rect = zone.getBoundingClientRect();
      if (
        e.clientX > rect.left &&
        e.clientX < rect.right &&
        e.clientY > rect.top &&
        e.clientY < rect.bottom
      ) {
        element.style.top = docks[dockId].top || '';
        element.style.left = docks[dockId].left || '';
        element.style.bottom = docks[dockId].bottom || '';
        element.style.right = docks[dockId].right || '';
        break;
      }
    }

    // Nettoyage visuel
    document.querySelectorAll('.redock-zone').forEach(z => z.classList.remove('active'));
  });
}
