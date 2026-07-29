(() => {
  const actions = document.querySelector(".hero-actions");
  const art = document.querySelector(".hero-art");
  if (!actions || !art) return;

  actions.innerHTML = `
    <a class="button button-primary" href="demos/wedding-party/">Explore Bea &amp; Milo’s Wedding</a>
    <a class="text-link" href="#work">View All Wedding Experiences <span aria-hidden="true">↘</span></a>
  `;

  art.insertAdjacentHTML("beforeend", `
    <div class="phone-preview" aria-label="Bea and Milo mobile wedding preview">
      <div class="phone-speaker"></div>
      <div class="phone-screen">
        <span class="phone-kicker">Bea &amp; Milo</span>
        <strong>Wedding<br>Weekend</strong>
        <span class="phone-date">OCT 02—04 · NOLA</span>
        <div class="phone-plan">
          <small>Saturday</small>
          <b>Ceremony</b>
          <span>5:30 PM · Marigny House</span>
        </div>
        <span class="phone-nav">HOME · PLAN · MAP</span>
      </div>
    </div>
    <div class="hero-foliage hero-foliage-one" aria-hidden="true"></div>
    <div class="hero-foliage hero-foliage-two" aria-hidden="true"></div>
  `);
})();
