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
    isDragging = false;
  });

  collapseBtn.addEventListener('click', () => {
    const isCollapsed = content.style.display === 'none';
    content.style.display = isCollapsed ? 'block' : 'none';
    collapseBtn.textContent = isCollapsed ? '−' : '+';
  });
});

// Auto-redock si proche des coins
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

window.addEventListener('resize', () => {
  panels.forEach(p => {
    const rect = p.getBoundingClientRect();
    // reposition if out of bounds
    if (rect.right > window.innerWidth) {
      p.style.left = `${window.innerWidth - rect.width - 10}px`;
    }
    if (rect.bottom > window.innerHeight) {
      p.style.top = `${window.innerHeight - rect.height - 10}px`;
    }
  });
});
