/* chickvideogames.com/cozyblockgarden - platform-aware store redirect + install attribution.
   SEO-safe: the page is indexable, and we DON'T redirect crawlers / link-preview
   bots (Googlebot, WhatsApp, etc.) so they read and index the real content.
   Progressive enhancement: the store badges in the HTML work with JS off.

   ATTRIBUTION: add ?s=<source> to this page's URL (e.g. /cozyblockgarden/?s=ig) and the
   store URL we send the visitor to carries a campaign tag, so installs can be split by
   channel in App Store Connect (App Analytics -> Campaigns) and Play Console (Acquisition).
   Apple needs BOTH pt (provider id) and ct (campaign) -> APPLE_PT below must be filled in
   with the pt value from a campaign link generated in App Store Connect. While it is empty
   the page still works, it just sends untagged Apple links. */
(function () {
  var APPLE = "https://apps.apple.com/us/app/cozy-block-garden-puzzle/id6789437905";
  var PLAY  = "https://play.google.com/store/apps/details?id=com.chickstudios.cozyblockgarden";

  // Apple provider id ("pt"), read off any campaign link generated in App Store Connect.
  // Empty string = Apple links stay untagged (Play tagging still works).
  var APPLE_PT = "";

  // Campaign source, from ?s= on this page. Allowlist-shaped: short, lowercase, safe chars.
  function source() {
    var m = /[?&]s=([A-Za-z0-9_-]{1,24})(?:&|$)/.exec(window.location.search || "");
    return m ? m[1].toLowerCase() : "";
  }

  function tagApple(url, s) {
    if (!s || !APPLE_PT) return url;
    return url + "?pt=" + encodeURIComponent(APPLE_PT) + "&ct=" + encodeURIComponent(s);
  }

  function tagPlay(url, s) {
    if (!s) return url;
    var referrer = "utm_source=" + s + "&utm_medium=social&utm_campaign=cbg_launch";
    return url + "&referrer=" + encodeURIComponent(referrer);
  }

  var s = source();
  var appleUrl = tagApple(APPLE, s);
  var playUrl  = tagPlay(PLAY, s);

  // Keep the visible fallback badges in sync, so a desktop click is attributed too.
  if (s) {
    var links = document.querySelectorAll(".badges a");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      if (href.indexOf("apps.apple.com") !== -1) links[i].setAttribute("href", appleUrl);
      else if (href.indexOf("play.google.com") !== -1) links[i].setAttribute("href", playUrl);
    }
  }

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

  var target = isAndroid ? playUrl : (isIOS ? appleUrl : null);
  if (target) {
    // replace() so the back button skips this redirect page.
    window.location.replace(target);
  }
  // Desktop / unknown: no redirect. The page message + store badges are the fallback.
})();
