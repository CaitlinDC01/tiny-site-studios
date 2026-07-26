(() => {
  const grid = document.querySelector(".portfolio-grid");
  if (!grid) return;

  const demos = `
    <article class="portfolio-card portfolio-live">
      <a class="portfolio-live-link" href="demos/garden/">
        <div class="portfolio-art portfolio-garden">
          <span class="portfolio-index">01</span>
          <span class="portfolio-monogram">A&amp;J</span>
          <span class="portfolio-demo">Explore Their Wedding ↗</span>
        </div>
        <div class="portfolio-caption">
          <div>
            <h3>Amelia &amp; Julian</h3>
            <p>Garden editorial wedding</p>
            <p class="portfolio-live-description">A romantic, story-rich wedding website inspired by magnolias, candlelight, and spring in Charleston.</p>
          </div>
          <span>Charleston, South Carolina</span>
        </div>
      </a>
    </article>
    <article class="portfolio-card portfolio-live">
      <a class="portfolio-live-link" href="demos/coastal/">
        <div class="portfolio-art portfolio-coastal">
          <span class="portfolio-index">02</span>
          <span class="portfolio-monogram">S&amp;C</span>
          <span class="portfolio-demo">Explore the Island ↗</span>
        </div>
        <div class="portfolio-caption">
          <div>
            <h3>Sofia &amp; Cameron</h3>
            <p>Isla Mujeres destination guide</p>
            <p class="portfolio-live-description">A mobile travel companion created to guide guests from touchdown through farewell brunch.</p>
          </div>
          <span>Isla Mujeres, Mexico</span>
        </div>
      </a>
    </article>
    <article class="portfolio-card portfolio-live">
      <a class="portfolio-live-link" href="demos/wedding-party/">
        <div class="portfolio-art portfolio-party">
          <span class="portfolio-index">03</span>
          <span class="portfolio-monogram">B&amp;M</span>
          <span class="portfolio-demo">Open the Party Hub ↗</span>
        </div>
        <div class="portfolio-caption">
          <div>
            <h3>Bea &amp; Milo</h3>
            <p>Wedding Party Hub</p>
            <p class="portfolio-live-description">A private-feeling mobile companion with role-specific details, schedules, attire, and wedding-day quick access.</p>
          </div>
          <span>New Orleans, Louisiana</span>
        </div>
      </a>
    </article>
  `;

  grid.insertAdjacentHTML("afterbegin", demos);
  [...grid.querySelectorAll(".portfolio-card:not(.portfolio-live) .portfolio-index")].forEach((index, position) => {
    index.textContent = String(position + 4).padStart(2, "0");
  });
})();
