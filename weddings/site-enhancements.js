(() => {
  const visuals = {
    "Save the Date": `
      <div class="pv-scene pv-save-date" aria-hidden="true">
        <div class="pv-envelope"><div class="pv-envelope-flap"></div></div>
        <div class="pv-announcement"><small>Please save the date</small><b>Nora <i>&amp;</i> Ellis</b><span>09 · 18 · 27</span><em>Santa Fe, New Mexico</em></div>
        <span class="pv-action-pill">Open announcement</span>
      </div>`,
    "Wedding Website": `
      <div class="pv-scene pv-website" aria-hidden="true">
        <div class="pv-browser"><div class="pv-browser-bar"><i></i><i></i><i></i><span>noraandellis.com</span></div><div class="pv-web-nav"><b>N + E</b><span>Story</span><span>Weekend</span><span>Travel</span></div><div class="pv-web-hero"><small>September 18, 2027</small><strong>Nora &amp; Ellis</strong><em>meet us in Santa Fe</em><button>Explore our weekend</button></div></div>
        <div class="pv-browser-base"></div>
      </div>`,
    "Digital Invitation": `
      <div class="pv-scene pv-invitation" aria-hidden="true">
        <div class="pv-phone"><div class="pv-phone-top"></div><div class="pv-invite-screen"><small>Together with their families</small><b>Ari <i>&amp;</i> Simone</b><span>October 2, 2027</span><em>The Foundry · Brooklyn</em><button>Joyfully RSVP</button></div></div>
        <div class="pv-notification"><i>✓</i><span><b>Invitation opened</b><small>RSVP ready</small></span></div>
      </div>`,
    "Bridal Shower": `
      <div class="pv-scene pv-shower" aria-hidden="true">
        <div class="pv-flower flower-one">✿</div><div class="pv-flower flower-two">✦</div>
        <div class="pv-arch-card"><small>Please join us for</small><b>Maya's</b><em>garden shower</em><span>May 16 · One o'clock</span><div><i>Lunch</i><i>Gifts</i><i>Recipes</i></div></div>
        <div class="pv-recipe-card"><small>Recipe for the bride</small><span>Sunday lemon pasta</span><b>＋ add yours</b></div>
      </div>`,
    "Celebration Weekend": `
      <div class="pv-scene pv-celebration" aria-hidden="true">
        <div class="pv-trip-card"><small>Palm Springs crew</small><b>Three sunny days</b><div class="pv-day-tabs"><span>FRI</span><span class="active">SAT</span><span>SUN</span></div><ul><li><time>9:30</time><span>Canyon walk</span></li><li><time>1:00</time><span>Pool afternoon</span></li><li><time>7:00</time><span>Group dinner</span></li></ul></div>
        <div class="pv-vote"><small>Saturday dinner</small><b>Desert tacos</b><span><i style="--fill:68%"></i></span><em>6 votes</em></div>
      </div>`,
    "Wedding Party Hub": `
      <div class="pv-scene pv-party-hub" aria-hidden="true">
        <div class="pv-hub-window"><div class="pv-hub-head"><b>The inner circle</b><span>Private hub</span></div><div class="pv-people"><i>A</i><i>J</i><i>M</i><i>R</i></div><div class="pv-hub-grid"><article><small>Your role</small><b>Maid of honor</b></article><article><small>Next up</small><b>Final fitting · 2 PM</b></article></div><ul><li><i>✓</i> Toast notes</li><li><i>✓</i> Ceremony arrival</li><li><i></i> Pack emergency kit</li></ul></div>
      </div>`,
    "Weekend Guide": `
      <div class="pv-scene pv-weekend" aria-hidden="true">
        <div class="pv-guide-phone"><div class="pv-guide-head"><small>Jo &amp; Ren's weekend</small><b>Saturday</b><span>New Orleans</span></div><div class="pv-guide-event"><time>4:10</time><span><b>Shuttles begin</b><small>Hotel courtyard</small></span><i>Ride</i></div><div class="pv-guide-event active"><time>5:00</time><span><b>Ceremony</b><small>The Glass House</small></span><i>Now</i></div><div class="pv-guide-event"><time>6:00</time><span><b>Dinner &amp; dancing</b><small>Courtyard</small></span><i>Next</i></div></div>
        <div class="pv-live-note"><i></i><span><b>Live update</b><small>Courtyard confirmed</small></span></div>
      </div>`,
    "Destination Guide": `
      <div class="pv-scene pv-destination" aria-hidden="true">
        <div class="pv-map"><span class="pv-road road-one"></span><span class="pv-road road-two"></span><i class="pin pin-one">1</i><i class="pin pin-two">2</i><i class="pin pin-three">3</i></div>
        <div class="pv-place-card"><small>Your island guide</small><b>Isla Mujeres</b><span><i>01</i> Casa de los Sueños</span><span><i>02</i> Playa Norte</span><span><i>03</i> Mango Café</span></div>
      </div>`,
    "Reception Companion": `
      <div class="pv-scene pv-reception" aria-hidden="true">
        <div class="pv-place-setting"><div class="pv-plate"><span>12</span></div><div class="pv-fork"></div><div class="pv-knife"></div></div>
        <div class="pv-menu-card"><small>Dani &amp; Luca</small><b>Dinner</b><span>Charred peach &amp; burrata</span><span>Wild mushroom risotto</span><span>Brown-butter cake</span></div>
        <div class="pv-seat-tag"><small>Your seat</small><b>Garden Room · 12</b></div>
      </div>`,
    "QR Guest Experience": `
      <div class="pv-scene pv-qr" aria-hidden="true">
        <div class="pv-place-card-qr"><small>Welcome, Taylor</small><b>Table 12</b><div class="pv-qr-code"></div><span>Scan for your guest guide</span></div>
        <div class="pv-mini-phone"><div class="pv-mini-screen"><small>Table 12</small><b>Tonight</b><span>Meet the table</span><span>View the menu</span><span>Request a song</span></div></div>
        <div class="pv-scan-line"></div>
      </div>`,
    "Memory Wall": `
      <div class="pv-scene pv-memories" aria-hidden="true">
        <div class="pv-memory-grid"><figure class="wide"><i></i><figcaption>the first dance</figcaption></figure><figure><i></i><figcaption>best night</figcaption></figure><blockquote>“The brass band surprise!”<cite>— Aunt Jo</cite></blockquote><figure><i></i><figcaption>last song</figcaption></figure><figure class="wide"><i></i><figcaption>our favorite people</figcaption></figure></div>
        <span class="pv-add-memory">＋ Add a memory</span>
      </div>`,
    "Thank You Site": `
      <div class="pv-scene pv-thanks" aria-hidden="true">
        <div class="pv-thank-window"><div class="pv-thank-photo"><span>E + J</span></div><div class="pv-thank-copy"><small>A note for our favorite people</small><b>Thank you</b><p>Our day felt even more extraordinary because you were there.</p><em>With all our love,<br>Elena &amp; James</em></div></div>
        <div class="pv-personal"><i>♥</i><span><b>Made personal</b><small>Family note selected</small></span></div>
      </div>`,
    "Anniversary Site": `
      <div class="pv-scene pv-anniversary" aria-hidden="true">
        <div class="pv-year-nav"><span class="active">2027</span><span>2028</span><span>2029</span><span>＋</span></div><div class="pv-year-story"><div class="pv-year-art"><b>2027</b><i></i></div><div><small>Chapter one · The wedding</small><b>Under the oak trees</b><p>We said yes and danced until the courtyard lights came on.</p><em>Open this chapter →</em></div></div>
      </div>`
  };

  document.querySelectorAll(".experience-card").forEach((card) => {
    const title = card.querySelector("h4")?.textContent.trim();
    const preview = card.querySelector(".experience-preview");
    if (!preview || !visuals[title]) return;
    preview.classList.add("has-product-visual");
    preview.dataset.product = title.toLowerCase().replaceAll(" ", "-");
    preview.innerHTML = visuals[title];
  });

  const partnerArt = document.querySelector(".partner-art");
  if (partnerArt) {
    partnerArt.innerHTML = `
      <div class="partner-ring" aria-hidden="true"></div>
      <a class="partner-logo-card partner-tss-card" href="../" aria-label="Visit Tiny Site Studios">
        <span class="partner-tss-main">Tiny Site Studios</span><span class="partner-tss-sub">Weddings</span>
      </a>
      <span class="partner-amp" aria-hidden="true">&amp;</span>
      <a class="partner-logo-card partner-lij-card" href="https://www.lilyinjune.com/" target="_blank" rel="noopener" aria-label="Visit Lily in June">
        <img src="assets/lily-in-june-logo.png" alt="Lily in June — Florals, Weddings, Events">
      </a>`;
  }

  const partnerCopy = document.querySelector(".partner-copy");
  if (partnerCopy) {
    partnerCopy.insertAdjacentHTML("beforeend", `
      <nav class="partner-links" aria-label="Lily in June links">
        <a href="https://www.lilyinjune.com/" target="_blank" rel="noopener">Website <span>↗</span></a>
        <a href="https://www.facebook.com/lilyinjune/" target="_blank" rel="noopener">Facebook <span>↗</span></a>
        <a href="https://www.instagram.com/lily_in_june/" target="_blank" rel="noopener">Instagram <span>↗</span></a>
      </nav>`);
  }

  const processArt = ["discover", "shape", "create", "celebrate"];
  document.querySelectorAll(".process-grid article").forEach((card, index) => {
    card.insertAdjacentHTML("afterbegin", `<div class="process-art process-${processArt[index]}" aria-hidden="true"><i></i><i></i><i></i><i></i></div>`);
  });

  const requestEmail = "mailto:caitlincloyd@gmail.com?subject=Wedding%20site%20request&body=Hi%20Caitlin%2C%0A%0AI%27d%20love%20to%20talk%20about%20a%20Tiny%20Site%20Studios%20wedding%20experience.%0A%0AOur%20names%3A%0AWedding%20date%3A%0ALocation%3A%0AWhat%20we%27re%20interested%20in%3A%0A%0AThank%20you!";
  const contactButton = document.querySelector(".contact .button");
  if (contactButton) {
    contactButton.href = requestEmail;
    contactButton.removeAttribute("target");
    contactButton.removeAttribute("rel");
    contactButton.textContent = "Email Caitlin about your wedding";
    contactButton.insertAdjacentHTML("afterend", `<p class="contact-email-note">Opens a pre-filled email to <strong>caitlincloyd@gmail.com</strong></p>`);
  }
})();
