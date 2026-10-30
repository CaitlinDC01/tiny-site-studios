/* Google Ads base tag. No form, storage, audio, or classroom interaction collection. */
(function (w, d) {
  'use strict';
  if (w.top !== w.self || w.__tssAdsConfigured) return;
  // Private share/projection links and arbitrary query values must not reach Ads.
  if (w.location.hash) return;
  var allowed = /^(utm_(source|medium|campaign|term|content)|gclid|dclid|gbraid|wbraid)$/;
  var params = new URLSearchParams(w.location.search);
  for (var key of params.keys()) if (!allowed.test(key)) return;
  w.__tssAdsConfigured = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  if (!d.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var tag = d.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18390015739';
    d.head.appendChild(tag);
    w.gtag('js', new Date());
  }
  w.gtag('config', 'AW-18390015739', {
    allow_ad_personalization_signals: false
  });
})(window, document);
