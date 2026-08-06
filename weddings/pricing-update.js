(() => {
  const section = document.querySelector(".packages");
  if (!section) return;

  const inquiryForm = "https://forms.gle/LHubEz2hcxd3kshz9";

  const inquiryLink = (name, label = `Inquire about ${name}`) =>
    `<a class="investment-cta" href="${inquiryForm}" target="_blank" rel="noopener" data-package="${name}" aria-label="${label} — opens the wedding project inquiry form">${label}<span aria-hidden="true">↗</span></a>`;

  section.classList.add("investment-section");
  section.innerHTML = `
    <div class="investment-intro">
      <div>
        <p class="eyebrow">Investment</p>
        <h2>Choose your wedding experience.</h2>
        <p class="section-script">thoughtfully done for you</p>
      </div>
      <div class="investment-positioning">
        <p class="investment-lead">More personal than a template. More approachable than a custom studio.</p>
        <p>Each collection is a fully managed guest experience—thoughtfully organized, beautifully designed, and launched for you.</p>
      </div>
    </div>

    <div class="investment-grid" aria-label="Wedding website packages">
      <article class="investment-card" aria-labelledby="essential-title">
        <div class="investment-card-head">
          <p class="investment-number">01</p>
          <p class="investment-note">Polished and straightforward</p>
          <h3 id="essential-title">Essential</h3>
          <p class="investment-price"><span aria-label="695 dollars">$695</span></p>
          <p>For couples who want a polished, straightforward site without the DIY.</p>
        </div>
        <ul>
          <li>Semi-custom design using a curated foundation</li>
          <li>Couple-supplied wording and photography</li>
          <li>Ceremony, reception, travel, registry, FAQ, and RSVP information</li>
          <li>Custom domain setup</li>
          <li>Mobile optimization and launch testing</li>
          <li>One consolidated revision round</li>
          <li>Hosting through 30 days after the wedding</li>
        </ul>
        ${inquiryLink("Essential")}
      </article>

      <article class="investment-card investment-featured" aria-labelledby="signature-title">
        <p class="investment-badge">Most popular · Recommended</p>
        <div class="investment-card-head">
          <p class="investment-number">02</p>
          <p class="investment-note">A beautifully managed extension of your wedding</p>
          <h3 id="signature-title">Signature</h3>
          <p class="investment-price"><span aria-label="1,250 dollars">$1,250</span></p>
          <p>A fully managed website designed as a natural extension of your celebration.</p>
        </div>
        <ul>
          <li>Everything in Essential</li>
          <li>Design coordinated with your colors, stationery, and aesthetic</li>
          <li>Light copy editing and content organization</li>
          <li>Multi-event schedule and RSVP setup</li>
          <li>Accommodations and local recommendations</li>
          <li>Wedding party or couple story section</li>
          <li>Two revision rounds</li>
          <li>Three post-launch update requests</li>
          <li>Planner collaboration</li>
        </ul>
        ${inquiryLink("Signature")}
      </article>

      <article class="investment-card" aria-labelledby="concierge-title">
        <div class="investment-card-head">
          <p class="investment-number">03</p>
          <p class="investment-note">For layered, multi-day celebrations</p>
          <h3 id="concierge-title">Concierge</h3>
          <p class="investment-price"><span aria-label="1,850 dollars">$1,850</span></p>
          <p>For destination, multi-day, or logistically complex weddings that need extra care.</p>
        </div>
        <ul>
          <li>Everything in Signature</li>
          <li>Expanded multi-day itinerary</li>
          <li>Private-event or guest-group RSVP organization</li>
          <li>Enhanced travel and accommodation guide</li>
          <li>Custom RSVP questions and guest instructions</li>
          <li>Digital save-the-date or invitation companion design</li>
          <li>Three revision rounds</li>
          <li>Five post-launch update requests</li>
          <li>Priority support through the wedding</li>
        </ul>
        ${inquiryLink("Concierge")}
      </article>

      <article class="investment-card investment-bespoke" aria-labelledby="bespoke-title">
        <div class="investment-card-head">
          <p class="investment-number">04</p>
          <p class="investment-note">An entirely original digital world</p>
          <h3 id="bespoke-title">Bespoke</h3>
          <p class="investment-price"><small>Starting at</small><span aria-label="2,500 dollars">$2,500</span></p>
          <p>For celebrations that call for an original layout or functionality beyond the collections above.</p>
        </div>
        <ul>
          <li>Original page and interaction design</li>
          <li>Custom illustration or visual storytelling</li>
          <li>Multilingual guest experiences</li>
          <li>Advanced RSVP needs</li>
          <li>Animation or other custom functionality</li>
          <li>Scope and pricing quoted individually</li>
        </ul>
        ${inquiryLink("Bespoke")}
      </article>
    </div>

    <details class="investment-scope">
      <summary><span>Scope, updates &amp; thoughtful extras</span><i aria-hidden="true">+</i></summary>
      <div class="investment-scope-body">
        <p class="scope-definition"><strong>Good to know:</strong> An update is one consolidated request. Work begins after all required wording, photography, guest details, and other content have been received.</p>
        <dl class="addon-grid">
          <div><dt>Extra revision</dt><dd>$125</dd></div>
          <div><dt>Substantial extra page or section</dt><dd>$150</dd></div>
          <div><dt>Rush delivery</dt><dd>+25%</dd></div>
          <div><dt>Bilingual experience</dt><dd>From $350</dd></div>
          <div><dt>Custom monogram</dt><dd>From $200</dd></div>
          <div><dt>Guest-list cleanup or import</dt><dd>From $150</dd></div>
          <div><dt>Additional year of hosting &amp; maintenance</dt><dd>$150 + domain costs</dd></div>
        </dl>
      </div>
    </details>

    <section class="planner-collaboration" aria-labelledby="planner-collaboration-title">
      <div>
        <p class="eyebrow">For wedding planners</p>
        <h3 id="planner-collaboration-title">Built into the planning experience.</h3>
        <p class="section-script">one less handoff</p>
      </div>
      <div>
        <p>Tiny Site Studios can be included within full-planning packages and coordinate directly with the planner—from collecting final details to organizing guest-facing updates.</p>
        <p>Planners are invited to ask about partner arrangements for upcoming celebrations.</p>
        ${inquiryLink("Planner partnership", "Inquire about a planner partnership")}
      </div>
    </section>
  `;
})();
