(() => {
  const demos = {
    "Save the Date": "demos/save-the-date/",
    "Wedding Website": "demos/garden/",
    "Digital Invitation": "demos/digital-invitation/",
    "Bridal Shower": "demos/bridal-shower/",
    "Celebration Weekend": "demos/celebration-weekend/",
    "Wedding Party Hub": "demos/wedding-party/",
    "Weekend Guide": "demos/weekend-guide/",
    "Destination Guide": "demos/coastal/",
    "Reception Companion": "demos/reception-companion/",
    "QR Guest Experience": "demos/qr-guest-experience/",
    "Guestbook Live": "/guestbook-live/",
    "Thank You Site": "demos/thank-you/",
    "Anniversary Site": "demos/anniversary/"
  };

  document.querySelectorAll(".experience-card").forEach((card) => {
    const title = card.querySelector("h4")?.textContent.trim();
    const preview = card.querySelector(".experience-preview");
    const demo = demos[title];
    if (!preview || !demo) return;

    const product = title.toLowerCase().replaceAll(" ", "-");
    preview.classList.add("has-live-demo");
    preview.dataset.product = product;
    preview.innerHTML = `
      <div class="demo-peek" aria-hidden="true">
        <iframe src="${demo}" loading="lazy" tabindex="-1" title="${title} demo preview"></iframe>
      </div>
      <span class="demo-peek-label">Live site preview</span>
      <span class="demo-peek-open">Explore <span aria-hidden="true">↗</span></span>
    `;
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
  if (partnerCopy && !partnerCopy.querySelector(".partner-links")) {
    partnerCopy.insertAdjacentHTML("beforeend", `
      <nav class="partner-links" aria-label="Lily in June links">
        <a href="https://www.lilyinjune.com/" target="_blank" rel="noopener">Website <span>↗</span></a>
        <a href="https://www.facebook.com/lilyinjune/" target="_blank" rel="noopener">Facebook <span>↗</span></a>
        <a href="https://www.instagram.com/lily_in_june/" target="_blank" rel="noopener">Instagram <span>↗</span></a>
      </nav>`);
  }

  const processArt = ["discover", "shape", "create", "celebrate"];
  document.querySelectorAll(".process-grid article").forEach((card, index) => {
    if (card.querySelector(".process-art")) return;
    card.insertAdjacentHTML("afterbegin", `<div class="process-art process-${processArt[index]}" aria-hidden="true"><i></i><i></i><i></i><i></i></div>`);
  });
})();
