// Chick Video Games — studio site. Accessible screenshot gallery + lightbox.
//
// Studio convention (codebase/WEB-STANDARDS.md §4) — every gallery of shots of the same game,
// on any page, behaves exactly like this. It follows two official W3C ARIA APG patterns:
//   · Dialog (Modal): focus moves in on open, Tab/Shift+Tab cycle inside, Esc closes,
//     focus returns to the thumbnail that opened it.
//   · Carousel controls: real <button> prev/next with accessible names, and a polite
//     live region announcing "N of M" (the WAI carousel tutorial's "Item x of y").
// Arrow keys move between the shots; the control at an end is greyed with aria-disabled
// (not `disabled`) so it stays focusable/discoverable and focus is never lost there.
(function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;

  var lbimg = lb.querySelector('.lb-img');
  var prev = lb.querySelector('.lb-nav.prev');
  var next = lb.querySelector('.lb-nav.next');
  var closeBtn = lb.querySelector('.x');
  var count = lb.querySelector('.lb-count');

  var shots = [];        // <img> of the gallery currently open
  var index = 0;
  var lastFocus = null;

  function render() {
    var img = shots[index];
    lbimg.src = img.getAttribute('data-full') || img.currentSrc || img.src;
    lbimg.alt = img.alt || '';

    var many = shots.length > 1;
    prev.hidden = next.hidden = count.hidden = !many;
    if (!many) return;
    prev.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
    next.setAttribute('aria-disabled', index === shots.length - 1 ? 'true' : 'false');
    count.textContent = (index + 1) + ' of ' + shots.length;
  }

  function go(delta) {
    var i = Math.min(Math.max(index + delta, 0), shots.length - 1);
    if (i === index) return;                       // already at the first / last shot
    index = i;
    render();
  }

  function open(trigger) {
    var gallery = trigger.closest('.shots');
    shots = Array.prototype.slice.call(gallery.querySelectorAll('img'));
    index = Math.max(shots.indexOf(trigger.querySelector('img')), 0);
    lastFocus = trigger;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    render();
    lb.focus();
  }

  function close() {
    if (!lb.classList.contains('open')) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    // Focus goes back to the thumbnail of the shot you were looking at (APG allows a more
    // logical target than the trigger — after browsing, that is where the user now is).
    var back = (shots[index] && shots[index].closest('.phone')) || lastFocus;
    if (back && typeof back.focus === 'function') back.focus();
  }

  // Tab / Shift+Tab stay inside the dialog (APG modal requirement).
  function trapTab(e) {
    var f = [closeBtn, prev, next].filter(function (el) { return el && !el.hidden; });
    var first = f[0], last = f[f.length - 1], at = document.activeElement;
    if (e.shiftKey && (at === first || at === lb)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  }

  document.querySelectorAll('.shots .phone').forEach(function (btn) {
    btn.addEventListener('click', function () { open(btn); });   // native button: Enter/Space too
  });

  lb.addEventListener('click', function (e) {
    var nav = e.target.closest('.lb-nav');
    if (!nav) { close(); return; }                 // backdrop, image or × closes
    if (nav.getAttribute('aria-disabled') !== 'true') go(nav === prev ? -1 : 1);
  });

  lb.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); go(1); break;
      case 'ArrowLeft': e.preventDefault(); go(-1); break;
      case 'Home': e.preventDefault(); go(-shots.length); break;
      case 'End': e.preventDefault(); go(shots.length); break;
      case 'Tab': trapTab(e); break;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
