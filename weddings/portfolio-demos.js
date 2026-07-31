(() => {
  const portfolio = document.querySelector("#work");
  const whyTiny = document.querySelector("#why");

  if (portfolio && whyTiny) {
    whyTiny.insertAdjacentElement("afterend", portfolio);
  }

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
    <article class="portfolio-card portfolio-live">
      <a class="portfolio-live-link" href="demos/city/">
        <div class="portfolio-art portfolio-city">
          <span class="portfolio-index">04</span>
          <span class="portfolio-monogram">M/T</span>
          <span class="portfolio-demo">Explore the City Wedding ↗</span>
        </div>
        <div class="portfolio-caption">
          <div>
            <h3>Maya &amp; Theo</h3>
            <p>Modern city wedding</p>
            <p class="portfolio-live-description">A sharp Chicago celebration with an interactive skyline, playlist preview, and gallery-night energy.</p>
          </div>
          <span>Chicago, Illinois</span>
        </div>
      </a>
    </article>
    <article class="portfolio-card portfolio-live">
      <a class="portfolio-live-link" href="demos/garden-party/">
        <div class="portfolio-art portfolio-garden-party">
          <span class="portfolio-index">05</span>
          <span class="portfolio-monogram">L&amp;R</span>
          <span class="portfolio-demo">Join the Garden Party ↗</span>
        </div>
        <div class="portfolio-caption">
          <div>
            <h3>Lena &amp; Rose</h3>
            <p>Garden party wedding</p>
            <p class="portfolio-live-description">A joyful Charleston garden filled with color, a flower oracle, and thoughtful guest tools.</p>
          </div>
          <span>Charleston, South Carolina</span>
        </div>
      </a>
    </article>
    <article class="portfolio-card portfolio-live">
      <a class="portfolio-live-link" href="demos/fall/">
        <div class="portfolio-art portfolio-fall">
          <span class="portfolio-index">06</span>
          <span class="portfolio-monogram">E&amp;J</span>
          <span class="portfolio-demo">Enter the Celebration ↗</span>
        </div>
        <div class="portfolio-caption">
          <div>
            <h3>Elena &amp; James</h3>
            <p>Elegant fall wedding</p>
            <p class="portfolio-live-description">A candlelit New Orleans evening with chapter storytelling and a transformable evening palette.</p>
          </div>
          <span>New Orleans, Louisiana</span>
        </div>
      </a>
    </article>
  `;

  grid.insertAdjacentHTML("afterbegin", demos);
  grid.querySelectorAll(".portfolio-card:not(.portfolio-live)").forEach((card) => card.remove());
})();
