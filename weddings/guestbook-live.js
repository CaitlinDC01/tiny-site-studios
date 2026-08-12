(() => {
  const demoUrl = "https://wall.tinysitestudios.com/bea-milo";
  const inquiryUrl = "https://forms.gle/LHubEz2hcxd3kshz9";

  const heroIntro = document.querySelector(".hero-intro");
  if (heroIntro) {
    heroIntro.insertAdjacentHTML("afterend", `
      <aside class="gl-announcement" aria-label="New product announcement">
        <p><strong>NEW: Guestbook Live</strong><span>Photos, videos, voices, and notes from everyone who shared your day.</span></p>
        <a href="#guestbook-live">Explore Guestbook Live <span aria-hidden="true">↓</span></a>
      </aside>`);
  }

  document.querySelector(".desktop-nav")?.insertAdjacentHTML(
    "beforeend",
    '<a href="#guestbook-live">Guestbook Live</a>'
  );
  document.querySelector(".mobile-menu nav")?.insertAdjacentHTML(
    "afterbegin",
    '<a href="#guestbook-live">Guestbook Live</a>'
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

  const suite = document.createElement("div");
  suite.className = "guestbook-live-suite";
  suite.innerHTML = `
    <section class="gl-spotlight" id="guestbook-live" aria-labelledby="guestbook-live-title">
      <div class="gl-glow gl-glow-one" aria-hidden="true"></div>
      <div class="gl-glow gl-glow-two" aria-hidden="true"></div>
      <div class="gl-spotlight-copy" data-gl-reveal>
        <p class="gl-kicker">New from Tiny Site Studios</p>
        <p class="gl-descriptor">Guestbook Live for Weddings</p>
        <h2 id="guestbook-live-title">Guestbook Live</h2>
        <p class="gl-script">Drop your memories here.</p>
        <p class="gl-lead">Your guests are already capturing moments you’ll never see. Give them one beautiful place to share the photos, videos, voice messages, and notes that tell the rest of your wedding-day story.</p>
        <p class="gl-proof">No app. No guest accounts. One QR code.</p>
        <div class="gl-actions">
          <a class="button button-primary" href="${demoUrl}" target="_blank" rel="noopener">Try Guestbook Live</a>
          <a class="gl-inline-link" href="${inquiryUrl}" target="_blank" rel="noopener">Add It to My Wedding <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="gl-product-stage" data-gl-reveal aria-label="Guestbook Live product preview">
        <div class="gl-browser-frame">
          <div class="gl-browser-top"><i></i><i></i><i></i><span>wall.tinysitestudios.com</span></div>
          <img src="assets/guestbook-live-cards.png" alt="Guestbook Live showing wedding photo and video memories">
        </div>
        <article class="gl-note-card" aria-label="Written wedding memory">
          <span>Written note</span>
          <blockquote>“The way you looked at each other during the last song — I’ll never forget it.”</blockquote>
          <small>— A favorite person</small>
        </article>
        <article class="gl-audio-card" aria-label="Voice message preview">
          <span class="gl-play">▶</span><div><b>Voice message</b><i><em></em><em></em><em></em><em></em><em></em><em></em><em></em><em></em><em></em></i></div><small>0:42</small>
        </article>
        <a class="gl-qr-float" href="${demoUrl}" target="_blank" rel="noopener" aria-label="Scan or open the Guestbook Live demo">
          <img src="assets/guestbook-live-demo-qr.png" alt="QR code for the Bea and Milo Guestbook Live demo"><span>Scan to try it</span>
        </a>
      </div>
    </section>

    <section class="gl-flow" aria-labelledby="gl-flow-title">
      <div class="gl-flow-heading" data-gl-reveal>
        <p class="gl-kicker">Made for the middle of the celebration</p>
        <h2 id="gl-flow-title">One QR code. Every memory.</h2>
        <a class="gl-drop-link" href="${demoUrl}" target="_blank" rel="noopener">+ Drop a Memory</a>
      </div>
      <ol class="gl-steps">
        <li data-gl-reveal><span>01</span><h3>Scan</h3><p>Guests scan the wedding QR code. No account or download required.</p></li>
        <li data-gl-reveal><span>02</span><h3>Drop</h3><p>They drop a photo, video, voice message, or note.</p></li>
        <li data-gl-reveal><span>03</span><h3>Relive</h3><p>The couple approves what appears and keeps the collection afterward.</p></li>
      </ol>
    </section>

    <section class="gl-stories" aria-label="Ways to share with Guestbook Live">
      <article class="gl-story" data-gl-reveal>
        <div class="gl-story-copy"><p class="gl-story-label">Photos</p><h2>Catch the moments you missed.</h2><p>Guests can take a photo or share up to five from their camera roll.</p><a class="gl-drop-link" href="${demoUrl}" target="_blank" rel="noopener">+ Drop a Memory</a></div>
        <div class="gl-screen gl-screen-photo"><img src="assets/guestbook-live-cards.png" alt="Photo and multi-photo posts in Guestbook Live"></div>
      </article>
      <article class="gl-story gl-story-reverse" data-gl-reveal>
        <div class="gl-story-copy"><p class="gl-story-label">Voice</p><h2>Some memories sound better than they look.</h2><p>Capture a toast they didn’t give, Grandma laughing, your best friend’s advice, or a message you’ll want to hear years later.</p><a class="gl-drop-link" href="${demoUrl}" target="_blank" rel="noopener">+ Drop a Memory</a></div>
        <div class="gl-screen gl-screen-audio"><img src="assets/guestbook-live-audio.png" alt="Guestbook Live voice-message recording screen"></div>
      </article>
      <article class="gl-story" data-gl-reveal>
        <div class="gl-story-copy"><p class="gl-story-label">Video</p><h2>See the night from their side.</h2><p>Guests can leave short video messages directly from their phones.</p><a class="gl-drop-link" href="${demoUrl}" target="_blank" rel="noopener">+ Drop a Memory</a></div>
        <div class="gl-video-composition">
          <div class="gl-screen gl-screen-video"><img src="assets/guestbook-live-cards.png" alt="A guest video post inside Guestbook Live"></div>
          <span class="gl-video-badge"><i>▶</i> 0:19</span>
        </div>
      </article>
      <article class="gl-story gl-story-reverse" data-gl-reveal>
        <div class="gl-story-copy"><p class="gl-story-label">Notes</p><h2>Keep the little messages, too.</h2><p>Written memories live alongside the photos, voices, and videos instead of in a separate guestbook.</p><a class="gl-drop-link" href="${demoUrl}" target="_blank" rel="noopener">+ Drop a Memory</a></div>
        <div class="gl-note-scene"><article class="gl-note-large"><span>To Bea &amp; Milo</span><blockquote>“May you always laugh this hard, dance this late, and find your way back to nights like this.”</blockquote><small>With love, Steph</small></article><div class="gl-screen gl-screen-note"><img src="assets/guestbook-live-contribute.png" alt="Guestbook Live contribution menu with the option to write a message"></div></div>
      </article>
    </section>

    <section class="gl-more" aria-labelledby="gl-more-title">
      <div class="gl-more-intro" data-gl-reveal><p class="gl-kicker">More than a shared album</p><h2 id="gl-more-title">Every kind of memory, held together.</h2><p>One living, moderated guestbook for the moments and perspectives a photographer cannot possibly capture.</p></div>
      <div class="gl-benefits" data-gl-reveal>
        <article><span>01</span><div><h3>No app required</h3><p>Scan and start sharing.</p></div></article>
        <article><span>02</span><div><h3>Everything together</h3><p>Photos, videos, voice messages, and notes in one guestbook.</p></div></article>
        <article><span>03</span><div><h3>You stay in control</h3><p>Approve memories before they appear publicly.</p></div></article>
        <article><span>04</span><div><h3>Made for your wedding</h3><p>Names, styling, colors, and photo frames can coordinate with the event.</p></div></article>
        <article><span>05</span><div><h3>Private couple dashboard</h3><p>Review, manage, and download memories afterward.</p></div></article>
      </div>
    </section>

    <section class="gl-demo" aria-labelledby="gl-demo-title">
      <div class="gl-demo-copy" data-gl-reveal><p class="gl-kicker">The Bea &amp; Milo demo</p><h2 id="gl-demo-title">Don’t take our word for it. Be a guest.</h2><p>Scan the QR code with your phone and experience Guestbook Live the way your guests will.</p><a class="button button-light" href="${demoUrl}" target="_blank" rel="noopener">Open the Live Demo</a></div>
      <a class="gl-demo-qr" href="${demoUrl}" target="_blank" rel="noopener" data-gl-reveal><img src="assets/guestbook-live-demo-qr.png" alt="QR code opening the public Bea and Milo Guestbook Live demo"><span>Point your camera here</span><small>wall.tinysitestudios.com/bea-milo</small></a>
    </section>

    <section class="gl-purchase" aria-labelledby="gl-price-title">
      <div class="gl-price-copy" data-gl-reveal><p class="gl-kicker">One beautifully simple package</p><h2 id="gl-price-title">Guestbook Live</h2><p class="gl-price"><span>$</span>119</p><p class="gl-price-line">One event. One QR code. A whole lot of memories.</p><a class="button button-primary" href="${inquiryUrl}" target="_blank" rel="noopener">Add Guestbook Live to My Wedding</a><p class="gl-custom"><strong>Want it coordinated with your wedding?</strong> Ask about custom styling, custom photo frames, and full-service setup.</p></div>
      <ul class="gl-inclusions" data-gl-reveal>
        <li>Guest photos</li><li>Up to 5 photos per post</li><li>Video messages up to 60 seconds</li><li>Voice messages up to 3 minutes</li><li>Written notes</li><li>Branded photo-frame options</li><li>Moderated live guestbook</li><li>Private couple dashboard</li><li>Up to 10 GB of storage</li><li>Contributions through 90 days after the wedding</li><li>12 months of access</li>
      </ul>
    </section>

    <section class="gl-together" aria-labelledby="gl-together-title">
      <div class="gl-together-heading" data-gl-reveal><p class="gl-kicker">Better together</p><h2 id="gl-together-title">Your wedding site gets them there. Guestbook Live captures what happens next.</h2></div>
      <div class="gl-together-flow" data-gl-reveal>
        <article><p>Before the wedding</p><h3>Tiny Site Wedding</h3><ul><li>wedding details</li><li>schedule</li><li>travel</li><li>wedding party</li><li>FAQs</li><li>guest information</li></ul></article>
        <span class="gl-together-mark" aria-hidden="true">→</span>
        <article><p>At the wedding</p><h3>Guestbook Live</h3><ul><li>photos</li><li>videos</li><li>voice messages</li><li>notes</li><li>guest memories</li><li>digital keepsake</li></ul></article>
      </div>
      <a class="button button-primary" href="${inquiryUrl}" target="_blank" rel="noopener">I Want Both</a>
    </section>

    <section class="gl-final" aria-labelledby="gl-final-title">
      <p class="gl-script" data-gl-reveal>the moments between the moments</p>
      <h2 id="gl-final-title" data-gl-reveal>Some of your favorite wedding memories won’t be taken by your photographer.</h2>
      <p data-gl-reveal>Make sure they find their way back to you.</p>
      <div class="gl-actions" data-gl-reveal><a class="button button-primary" href="${inquiryUrl}" target="_blank" rel="noopener">Get Guestbook Live</a><a class="gl-inline-link" href="#experiences">Explore Wedding Sites <span aria-hidden="true">↓</span></a></div>
    </section>`;

  const portfolio = document.querySelector("#work");
  const fallback = document.querySelector("#experiences");
  (portfolio || fallback)?.insertAdjacentElement("afterend", suite);

  if (window.location.hash === "#guestbook-live") {
    suite.querySelectorAll("#guestbook-live [data-gl-reveal]").forEach((item) => item.classList.add("is-visible"));
    requestAnimationFrame(() => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      suite.querySelector("#guestbook-live")?.scrollIntoView();
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    });
  }

  const revealItems = suite.querySelectorAll("[data-gl-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7%" });
    revealItems.forEach((item) => observer.observe(item));
  }
})();
