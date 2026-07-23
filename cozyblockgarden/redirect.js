/* chickvideogames.com/cozyblockgarden - platform-aware store redirect + install attribution.
   SEO-safe: the page is indexable, and we DON'T redirect crawlers / link-preview
   bots (Googlebot, WhatsApp, etc.) so they read and index the real content.
   Progressive enhancement: the store badges in the HTML work with JS off.

   ATTRIBUTION: add ?s=<source> to this page's URL (e.g. /cozyblockgarden/?s=ig) and the
   store URL we send the visitor to carries a campaign tag, so installs can be split by
   channel in App Store Connect (App Analytics -> Campaigns) and Play Console (Acquisition).
   Apple needs BOTH pt (provider id) and ct (campaign). ⚠️ App Store Connect only shows a
   campaign once at least 5 individual Apple accounts have installed from it (privacy
   threshold), so low-volume sources read as zero there for a while - Play is the finer
   signal early on. */
(function () {
  var APPLE = "https://apps.apple.com/us/app/cozy-block-garden-puzzle/id6789437905";
  var PLAY  = "https://play.google.com/store/apps/details?id=com.chickstudios.cozyblockgarden";

  // Apple provider id ("pt") + the exact link shape App Store Connect generates for campaigns
  // (locale-neutral /app/apple-store/id..., not the pretty slug URL). Public by design: it
  // appears in every campaign link. Empty APPLE_PT = Apple links stay untagged.
  var APPLE_PT = "129150744";
  var APPLE_CAMPAIGN = "https://apps.apple.com/app/apple-store/id6789437905";

  // Explicit source, from ?s= on this page. Allowlist-shaped: short, lowercase, safe chars.
  function explicitSource() {
    var m = /[?&]s=([A-Za-z0-9_-]{1,24})(?:&|$)/.exec(window.location.search || "");
    return m ? m[1].toLowerCase() : "";
  }

  // Fallback when there is no ?s=: infer the source from the referring HOST, so links
  // published before tagging existed (and anything re-shared) still get attributed.
  //
  // Why hostname-only is the right unit (MDN, Referrer-Policy): the browser default is
  // "strict-origin-when-cross-origin", which sends only the ORIGIN on a cross-origin
  // navigation - never the path. So the host is all we can ever rely on.
  // document.referrer is "" for direct navigation (bookmark, typed URL) and for sites
  // that set Referrer-Policy: no-referrer -> those simply stay untagged.
  //
  // Partial by design: in-app browsers (Instagram, TikTok, WhatsApp) frequently send NO
  // referrer at all - that is exactly why explicit ?s= tagging is the primary mechanism.
  // Inferred hits land in the SAME bucket as explicit ones on purpose: splitting them
  // would fragment low volumes below Apple's 5-install reporting threshold.
  var REFERRER_MAP = [
    ["instagram.com", "ig"],
    ["tiktok.com",    "tt"],
    ["youtube.com",   "yt"],
    ["youtu.be",      "yt"],
    ["reddit.com",    "reddit"],
    ["x.com",         "x"],
    ["twitter.com",   "x"],
    ["t.co",          "x"],
    ["facebook.com",  "fb"],
    ["linkedin.com",  "li"],
    ["lnkd.in",       "li"],
    ["bing.com",      "bing"],
    ["duckduckgo.com","ddg"]
  ];
  // google.com and every ccTLD variant (google.com.ar, google.es, ...).
  var GOOGLE_HOST = /(^|\.)google(\.[a-z]{2,3}){1,2}$/;

  // Exact host or a real subdomain of it - NOT a substring match, so a host like
  // "instagram.com.example.net" can't be mistaken for Instagram.
  function hostIs(host, domain) {
    return host === domain || host.slice(-(domain.length + 1)) === "." + domain;
  }

  function referrerSource() {
    var ref = document.referrer || "";
    if (!ref) return "";
    var host = "";
    try { host = new URL(ref).hostname.toLowerCase(); } catch (e) { return ""; }
    for (var i = 0; i < REFERRER_MAP.length; i++) {
      if (hostIs(host, REFERRER_MAP[i][0])) return REFERRER_MAP[i][1];
    }
    if (GOOGLE_HOST.test(host)) return "google";
    return "";
  }

  function source() {
    return explicitSource() || referrerSource();
  }

  function tagApple(url, s) {
    if (!s || !APPLE_PT) return url;
    return APPLE_CAMPAIGN + "?pt=" + encodeURIComponent(APPLE_PT) +
           "&ct=" + encodeURIComponent(s) + "&mt=8";
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
