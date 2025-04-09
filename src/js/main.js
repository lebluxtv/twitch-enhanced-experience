function makeDraggable(el) {
  let offsetX = 0, offsetY = 0, isDown = false;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    offsetX = el.offsetLeft - e.clientX;
    offsetY = el.offsetTop - e.clientY;
    el.style.zIndex = 999; // on top
  });

  document.addEventListener('mouseup', () => isDown = false);

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    el.style.left = `${e.clientX + offsetX}px`;
    el.style.top = `${e.clientY + offsetY}px`;
  });
}

document.querySelectorAll('.floating-panel').forEach(panel => {
  makeDraggable(panel);
});
