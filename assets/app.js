// Chick Video Games — studio site. Accessible lightbox for the game screenshots.
(function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbimg = lb.querySelector('img');
  var lastFocus = null;

  function open(src, trigger) {
    lastFocus = trigger || null;
    lbimg.src = src;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    lb.focus();
  }
  function close() {
    if (!lb.classList.contains('open')) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.querySelectorAll('.shots img').forEach(function (img) {
    img.addEventListener('click', function () { open(img.currentSrc || img.src, img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        open(img.currentSrc || img.src, img);
      }
    });
  });

  lb.addEventListener('click', close);            // click anywhere (backdrop, image, ×) closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
