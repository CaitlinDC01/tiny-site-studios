(() => {
  const actions = document.querySelector(".hero-actions");
  const art = document.querySelector(".hero-art");
  if (!actions || !art) return;

  actions.innerHTML = `
    <a class="button button-primary" href="demos/wedding-party/">Explore Bea &amp; Milo’s Wedding</a>
    <a class="text-link" href="#work">View All Wedding Experiences <span aria-hidden="true">↘</span></a>
  `;

  art.innerHTML = `
    <div class="hero-orbit orbit-one" aria-hidden="true"></div>
    <div class="hero-orbit orbit-two" aria-hidden="true"></div>
    <a class="real-invitation-laptop" href="demos/wedding-party/" aria-label="Explore Bea and Milo’s wedding experience">
      <img src="assets/bea-milo-device-hero.png" alt="Floating laptop showing Bea and Milo’s moody wedding invitation with the matching wedding party app on a phone">
      <span class="sr-only">Bea and Milo’s real invitation shown on a floating laptop.</span>
    </a>
  `;
})();
