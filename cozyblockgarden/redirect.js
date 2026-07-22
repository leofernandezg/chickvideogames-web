/* chickvideogames.com/cozyblockgarden - platform-aware store redirect.
   SEO-safe: the page is indexable, and we DON'T redirect crawlers / link-preview
   bots (Googlebot, WhatsApp, etc.) so they read and index the real content.
   Progressive enhancement: the store badges in the HTML work with JS off. */
(function () {
  var APPLE = "https://apps.apple.com/us/app/cozy-block-garden-puzzle/id6789437905";
  var PLAY  = "https://play.google.com/store/apps/details?id=com.chickstudios.cozyblockgarden";

  var ua = navigator.userAgent || navigator.vendor || "";
  var lc = ua.toLowerCase();

  // Never redirect crawlers / preview fetchers -> let them index the page content.
  // (False positives are harmless: that visitor just sees the page + store buttons.)
  if (/bot|crawler|spider|crawling|facebookexternalhit|whatsapp|telegram|twitterbot|slurp|bingpreview|applebot|duckduckbot|yandex|baidu|semrush|ahrefs|lighthouse|headless|preview|embed/.test(lc)) {
    return;
  }

  var isAndroid = /android/i.test(ua);
  // iPadOS 13+ Safari reports as desktop Mac -> catch it via touch points.
  var isIOS = /iphone|ipad|ipod/i.test(ua) ||
              (/Mac/i.test(navigator.platform || "") && (navigator.maxTouchPoints || 0) > 1);

  var target = isAndroid ? PLAY : (isIOS ? APPLE : null);
  if (target) {
    // replace() so the back button skips this redirect page.
    window.location.replace(target);
  }
  // Desktop / unknown: no redirect. The page message + store badges are the fallback.
})();
