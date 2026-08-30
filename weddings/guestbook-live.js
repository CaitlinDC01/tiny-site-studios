(() => {
  const productUrl = "https://guestbook.tinysitestudios.com/";
  const demoUrl = "https://wall.tinysitestudios.com/bea-milo";

  const heroIntro = document.querySelector(".hero-intro");
  if (heroIntro) {
    heroIntro.insertAdjacentHTML("afterend", `
      <aside class="gl-announcement" aria-label="Guestbook Live announcement">
        <p><strong>Guestbook Live</strong><span>Photos, videos, voices, and notes from everyone who shared your day.</span></p>
        <a href="${productUrl}">Explore <span aria-hidden="true">↗</span></a>
      </aside>`);
  }

  document.querySelector(".desktop-nav")?.insertAdjacentHTML(
    "beforeend",
    `<a href="${productUrl}">Guestbook Live</a>`
  );
  document.querySelector(".mobile-menu nav")?.insertAdjacentHTML(
    "afterbegin",
    `<a href="${productUrl}">Guestbook Live</a>`
  );

  document.querySelectorAll('a[href="#work"]').forEach((link) => {
    const label = link.textContent.trim();
    if (label === "Work") link.textContent = "Sample Sites";
    if (label.startsWith("View the stories") || label.startsWith("View All Wedding Experiences")) {
      link.innerHTML = 'View Sample Sites <span aria-hidden="true">↘</span>';
    }
  });

  const portfolioEyebrow = document.querySelector("#work .portfolio-heading .eyebrow");
  if (portfolioEyebrow) portfolioEyebrow.textContent = "Wedding Site Samples";

  const section = document.createElement("section");
  section.className = "gl-compact";
  section.id = "guestbook-live";
  section.setAttribute("aria-labelledby", "guestbook-live-title");
  section.innerHTML = `
    <div class="gl-compact-copy">
      <p class="gl-kicker">Guestbook Live</p>
      <h2 id="guestbook-live-title">The wedding day, from everyone’s point of view.</h2>
      <p class="gl-compact-lead">One beautiful, private place for your guests to share the photos, videos, voice messages, and notes you would otherwise miss.</p>
      <ul class="gl-compact-proof" aria-label="Guestbook Live highlights">
        <li>No app or guest accounts</li>
        <li>One easy QR code</li>
        <li>You approve what appears</li>
      </ul>
      <div class="gl-actions">
        <a class="button button-primary" href="${productUrl}">Explore Guestbook Live</a>
        <a class="gl-inline-link" href="${demoUrl}" target="_blank" rel="noopener">Try the Bea &amp; Milo demo <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="gl-compact-art" aria-label="Guestbook Live wedding memory preview">
      <div class="gl-compact-browser">
        <div class="gl-browser-top"><i></i><i></i><i></i><span>Guestbook Live · Bea &amp; Milo</span></div>
        <img src="assets/guestbook-live-cards.png" alt="Guestbook Live showing Bea and Milo's wedding memories">
      </div>
      <div class="gl-compact-phone">
        <img src="assets/guestbook-live-messages-photos.png" alt="Guestbook Live messages, photos, and videos on a phone">
      </div>
      <a class="gl-compact-qr" href="${demoUrl}" target="_blank" rel="noopener" aria-label="Open the Bea and Milo Guestbook Live wedding demo">
        <img src="assets/guestbook-live-demo-qr.png" alt="">
        <span><b>Try it live</b><small>Scan with your phone</small></span>
      </a>
    </div>`;

  const portfolio = document.querySelector("#work");
  const fallback = document.querySelector("#experiences");
  (portfolio || fallback)?.insertAdjacentElement("afterend", section);
})();
