// Chick Video Games — studio site. Lightbox for the game screenshots.
(function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbimg = lb.querySelector('img');
  function open(src) { lbimg.src = src; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); }
  function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
  document.querySelectorAll('.shots img').forEach(function (img) {
    img.addEventListener('click', function () { open(img.currentSrc || img.src); });
  });
  lb.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
