/* Share button on the game card: native share sheet (Web Share API) with a
   copy-to-clipboard fallback + a small "Link copied!" toast. Shares the smart
   download link so recipients get the platform-aware redirect + the OG card. */
(function () {
  var btn = document.getElementById("shareBtn");
  if (!btn) return;
  var url = btn.getAttribute("data-url");
  // URL ONLY on purpose: the OS share sheet's "Copy" then yields a clean, pasteable
  // link, and targets like WhatsApp/Messages render the page's OG card (title + image)
  // themselves. Including title/text makes "Copy" concatenate them into an unusable string.
  var data = { url: url };
  var toast = document.getElementById("shareToast");
  var timer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }
  btn.addEventListener("click", function () {
    if (navigator.share) {
      // Native OS share sheet (mobile + Safari/Edge desktop). User-cancel -> ignore.
      navigator.share(data).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast("Link copied!");
      }).catch(function () {
        window.prompt("Copy this link:", url);
      });
    } else {
      window.prompt("Copy this link:", url);
    }
  });
})();
