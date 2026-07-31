(() => {
  const key = document.body.dataset.demo;
  const root = document.querySelector("#demo-root");
  if (!root) return;

  const identities = {
    "save-the-date": ["Nora & Ellis", "Save the date"],
    "digital-invitation": ["Ari & Simone", "Invitation"],
    "bridal-shower": ["Maya’s Shower", "May 16, 2027"],
    "celebration-weekend": ["Palm Springs Crew", "June 11–13"],
    "weekend-guide": ["Jo & Ren", "Weekend guide"],
    "reception-companion": ["Dani & Luca", "Reception"],
    "qr-guest": ["Dani & Luca", "Table Twelve"],
    "memory-wall": ["Cam & Riley", "Memory wall"],
    "thank-you": ["Elena & James", "With gratitude"],
    "anniversary": ["Leah & Morgan", "Our years"]
  };

  const identity = identities[key];
  if (!identity) {
    root.textContent = "Demo not found.";
    return;
  }

  const shell = (content, navLinks = "") => `
    <div class="demo-ribbon">
      <a href="../../#experiences">← Wedding collection</a>
      Fictional example · every client experience is designed from scratch
    </div>
    <header class="experience-nav">
      <a class="experience-brand" href="#top">${identity[0]}</a>
      <nav aria-label="Page navigation">${navLinks}<a class="nav-action" href="https://forms.gle/LHubEz2hcxd3kshz9" target="_blank" rel="noopener">Request yours</a></nav>
    </header>
    <main class="experience-page" id="top">${content}</main>
    <footer class="experience-footer">
      <strong>${identity[0]}</strong>
      <a href="../../#experiences">Explore another wedding experience →</a>
    </footer>
  `;

  const hero = ({ kicker, names, title, date, copy = "", actions = "", extraClass = "" }) => `
    <section class="experience-hero ${extraClass}">
      <div class="hero-inner">
        <p class="kicker">${kicker}</p>
        ${names ? `<h1 class="hero-names">${names}</h1>` : ""}
        ${title ? `<h2 class="hero-title">${title}</h2>` : ""}
        ${date ? `<p class="hero-date">${date}</p>` : ""}
        ${copy ? `<p class="hero-copy">${copy}</p>` : ""}
        ${actions ? `<div class="button-row">${actions}</div>` : ""}
      </div>
    </section>
  `;

  const pages = {
    "save-the-date": () => shell(`
      ${hero({
        kicker: "Save the date",
        names: "Nora & Ellis",
        title: "We’re getting married.",
        date: "September 18, 2027 · Santa Fe, New Mexico",
        copy: "We can’t wait to celebrate under the wide-open New Mexico sky.",
        actions: '<a class="button" href="#open-note">Open our note</a><button class="button secondary" type="button" data-share>Share</button>'
      })}
      <section class="content-section tint" id="open-note">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">A note for you</p><h2>There’s more<br><span class="script-line">inside the envelope</span></h2></div>
            <p>Open the announcement to reveal the full date, setting, and a calendar event guests can actually download.</p>
          </div>
          <div class="envelope-wrap" data-envelope-wrap>
            <div class="envelope">
              <article class="envelope-letter">
                <span class="mini-label">Please save the date</span>
                <h2>Nora &amp; Ellis</h2>
                <p>Saturday, September 18, 2027<br>La Mesita Ranch · Santa Fe</p>
                <div class="button-row">
                  <button class="button" type="button" data-calendar>Download calendar event</button>
                </div>
              </article>
            </div>
          </div>
          <div class="button-row">
            <button class="button" type="button" data-open-envelope>Open the envelope</button>
          </div>
          <output data-status aria-live="polite"></output>
        </div>
      </section>
      <section class="content-section" id="details">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">The essentials</p><h2>One beautiful<br><span class="script-line">first impression</span></h2></div>
            <p>The full invitation and travel details will follow. For now, guests have the date, place, and an easy way to remember both.</p>
          </div>
          <div class="detail-grid">
            <article class="detail-card"><span>Date</span><strong>September 18, 2027</strong><p>A late-summer Saturday in Santa Fe.</p></article>
            <article class="detail-card"><span>Place</span><strong>La Mesita Ranch</strong><p>Just north of the city, beneath the Sangre de Cristo Mountains.</p></article>
            <article class="detail-card"><span>Next</span><strong>Invitation to follow</strong><p>Travel notes and the full weekend schedule arrive this spring.</p></article>
          </div>
        </div>
      </section>
    `, '<a href="#open-note">Open</a><a href="#details">Details</a>'),

    "digital-invitation": () => shell(`
      <div class="overlay" data-invitation-cover>
        <div class="invitation-cover">
          <div>
            <p class="kicker">You’re invited</p>
            <h1 class="hero-names">Ari &amp; Simone</h1>
            <p class="hero-date">October 2, 2027 · Brooklyn</p>
            <div class="button-row"><button class="button" type="button" data-enter-invitation>Open the invitation</button></div>
          </div>
        </div>
      </div>
      ${hero({
        kicker: "Together with their families",
        names: "Ari & Simone",
        title: "Invite you to dinner, dancing, and the beginning of forever.",
        date: "October 2, 2027 · The Foundry · New York",
        actions: '<button class="button" type="button" data-open-rsvp>Respond to the invitation</button><a class="button secondary" href="#details">View details</a>'
      })}
      <section class="content-section tint" id="details">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">The celebration</p><h2>One evening,<br><span class="script-line">beautifully paced</span></h2></div>
            <p>Everything guests need lives inside the invitation—no loose cards, no hunting through old messages.</p>
          </div>
          <div class="detail-grid">
            <article class="detail-card"><span>Five thirty</span><strong>Ceremony</strong><p>The courtyard at The Foundry. Please arrive by 5:10.</p></article>
            <article class="detail-card"><span>Six fifteen</span><strong>Cocktails</strong><p>Drinks, small plates, and a little live jazz in the greenhouse.</p></article>
            <article class="detail-card"><span>Seven thirty</span><strong>Dinner & dancing</strong><p>Creative formal attire. Color and personality encouraged.</p></article>
          </div>
        </div>
      </section>
      <section class="content-section">
        <div class="section-shell">
          <div class="form-card">
            <div class="section-heading">
              <div><p class="kicker">A small request</p><h2>Please reply by<br><span class="script-line">August first</span></h2></div>
              <p>Use the invitation response to collect attendance, meal choices, and a guest note in one graceful flow.</p>
            </div>
            <button class="button" type="button" data-open-rsvp>Open RSVP</button>
          </div>
        </div>
      </section>
      <dialog data-rsvp-dialog>
        <div class="dialog-inner">
          <div class="dialog-head"><h2>Your response</h2><button class="icon-button" type="button" data-close-dialog aria-label="Close">×</button></div>
          <form class="form-grid" data-rsvp-form>
            <label>Name<input required value="Taylor Morgan"></label>
            <label>Attendance<select name="attendance"><option>Joyfully accepts</option><option>Regretfully declines</option></select></label>
            <label>Entrée<select><option>Herb-roasted chicken</option><option>Wild mushroom risotto</option></select></label>
            <label>Song request<input value="You Make My Dreams"></label>
            <label class="wide">Note for the couple<textarea>We cannot wait to celebrate with you!</textarea></label>
            <button class="button wide" type="submit">Send response</button>
          </form>
          <output data-rsvp-status aria-live="polite"></output>
        </div>
      </dialog>
    `, '<a href="#details">Details</a><a href="#rsvp" data-open-rsvp>RSVP</a>'),

    "bridal-shower": () => shell(`
      ${hero({
        kicker: "Please join us for",
        names: "Maya’s Shower",
        title: "A garden lunch for the bride-to-be.",
        date: "Sunday, May 16 · One o’clock · The Conservatory",
        copy: "Hosted with love by Ana, Priya, and Jo.",
        actions: '<a class="button" href="#afternoon">See the afternoon</a><a class="button secondary" href="#registry">Registry</a>'
      })}
      <section class="content-section tint" id="afternoon">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">The afternoon</p><h2>Lunch, laughter,<br><span class="script-line">and a few surprises</span></h2></div>
            <p>Come ready for a long lunch, a little friendly competition, and plenty of time to celebrate Maya.</p>
          </div>
          <div class="timeline">
            <article class="timeline-item"><time>1:00 PM</time><div><strong>Garden lunch</strong><p>Seasonal plates, iced tea, and champagne.</p></div><em>Conservatory</em></article>
            <article class="timeline-item"><time>2:15 PM</time><div><strong>A little game</strong><p>How well do you know Maya?</p></div><em>Greenhouse</em></article>
            <article class="timeline-item"><time>3:00 PM</time><div><strong>Gifts & cake</strong><p>Bring a favorite recipe for Maya’s keepsake book.</p></div><em>Library</em></article>
          </div>
        </div>
      </section>
      <section class="content-section" id="registry">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">Thoughtful details</p><h2>Registry and<br><span class="script-line">recipe keepsake</span></h2></div>
            <p>Maya and Theo have chosen a few things for their home—and Maya’s friends are making her a recipe book for the years ahead.</p>
          </div>
          <div class="feature-board">
            <article class="feature-panel">
              <span class="mini-label">Registry</span><h3>A few favorite places</h3><p>Heath Ceramics, Food52, and a honeymoon cooking-class fund.</p>
              <div class="button-row" style="justify-content:flex-start"><button class="button secondary" type="button" data-open-registry>View the registry</button></div>
              <output data-registry-status aria-live="polite"></output>
            </article>
            <article class="feature-panel">
              <span class="mini-label">Recipe book</span><h3>Share one from your kitchen</h3>
              <form class="form-grid" data-recipe-form>
                <label>Your name<input required value="Taylor"></label>
                <label>Recipe<input required value="Sunday lemon pasta"></label>
                <button class="button wide" type="submit">Add recipe card</button>
              </form>
              <output data-recipe-status aria-live="polite"></output>
            </article>
          </div>
        </div>
      </section>
      <dialog data-registry-dialog>
        <div class="dialog-inner">
          <div class="dialog-head"><h2>Maya &amp; Theo’s registry</h2><button class="icon-button" type="button" data-close-dialog aria-label="Close">×</button></div>
          <div class="detail-grid">
            <article class="detail-card"><span>For their table</span><strong>Heath Ceramics</strong><p>Coupe dinnerware in linen and mist.</p><button class="button secondary" type="button" data-registry-choice="Heath Ceramics">Choose a gift</button></article>
            <article class="detail-card"><span>For their kitchen</span><strong>Food52</strong><p>A few hardworking pieces for Sunday dinners.</p><button class="button secondary" type="button" data-registry-choice="Food52">Choose a gift</button></article>
            <article class="detail-card"><span>For the honeymoon</span><strong>Cooking in Florence</strong><p>Help send them to a pasta-making class.</p><button class="button secondary" type="button" data-registry-choice="Florence cooking class">Contribute</button></article>
          </div>
          <output data-registry-dialog-status aria-live="polite"></output>
        </div>
      </dialog>
    `, '<a href="#afternoon">Schedule</a><a href="#registry">Registry</a>'),

    "celebration-weekend": () => shell(`
      ${hero({
        kicker: "The group trip",
        names: "Palm Springs",
        title: "Three sun-soaked days with the favorite people.",
        date: "June 11–13 · Casa Palma",
        copy: "The itinerary, house details, packing list, and group decisions all live here.",
        actions: '<a class="button" href="#plans">Open the itinerary</a><a class="button secondary" href="#packing">Packing list</a>'
      })}
      <section class="content-section tint" id="plans">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">The plan</p><h2>Every address,<br><span class="script-line">right when you need it</span></h2></div>
            <p>Switch days to see the real trip plan. Timing, attire, rides, and notes stay attached to each event.</p>
          </div>
          <div class="tabs" role="tablist" aria-label="Trip days">
            <button class="tab active" role="tab" aria-selected="true" data-trip-day="fri">Friday</button>
            <button class="tab" role="tab" aria-selected="false" data-trip-day="sat">Saturday</button>
            <button class="tab" role="tab" aria-selected="false" data-trip-day="sun">Sunday</button>
          </div>
          <div class="timeline" data-trip-itinerary></div>
        </div>
      </section>
      <section class="content-section" id="packing">
        <div class="section-shell">
          <div class="feature-board">
            <article class="feature-panel">
              <span class="mini-label">Group decision</span><h3>Saturday dinner</h3><p>Vote once and watch the group choice update.</p>
              <div class="poll-options">
                <div class="poll-row"><button class="chip" type="button" data-vote="tacos">Desert tacos</button><div class="meter"><span data-meter="tacos" style="--value:50%"></span></div><b data-count="tacos">4</b></div>
                <div class="poll-row"><button class="chip" type="button" data-vote="pool">Poolside dinner</button><div class="meter"><span data-meter="pool" style="--value:50%"></span></div><b data-count="pool">4</b></div>
              </div>
              <output data-vote-status aria-live="polite">The vote is tied.</output>
            </article>
            <article class="feature-panel">
              <span class="mini-label">Your packing list</span><h3>Check it off as you pack</h3>
              <div class="check-list">
                <label><input type="checkbox" data-pack> Swimsuit and pool layer</label>
                <label><input type="checkbox" data-pack> Sneakers for the canyon walk</label>
                <label><input type="checkbox" data-pack> Bright dinner look</label>
                <label><input type="checkbox" data-pack> Sunscreen and refillable bottle</label>
              </div>
              <output data-pack-status aria-live="polite">0 of 4 packed.</output>
            </article>
          </div>
        </div>
      </section>
    `, '<a href="#plans">Itinerary</a><a href="#packing">Group tools</a>'),

    "weekend-guide": () => shell(`
      ${hero({
        kicker: "Welcome to New Orleans",
        names: "Jo & Ren",
        title: "Your guide to a very good weekend.",
        date: "October 8–10, 2027",
        copy: "Save this page to your phone for the latest timing, shuttles, addresses, and dress notes.",
        actions: '<a class="button" href="#schedule">Today’s schedule</a><button class="button secondary" type="button" data-copy-hotel>Copy hotel address</button>'
      })}
      <section class="content-section tint" id="schedule">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">Weekend schedule</p><h2>Know where to be.<br><span class="script-line">Enjoy being there.</span></h2></div>
            <p>Timing may shift slightly through the weekend. This page will always have the latest plan.</p>
          </div>
          <div class="tabs" role="tablist" aria-label="Weekend days">
            <button class="tab active" role="tab" aria-selected="true" data-guide-day="fri">Friday</button>
            <button class="tab" role="tab" aria-selected="false" data-guide-day="sat">Saturday</button>
            <button class="tab" role="tab" aria-selected="false" data-guide-day="sun">Sunday</button>
          </div>
          <div class="timeline" data-guide-itinerary></div>
          <output data-guide-status aria-live="polite"></output>
        </div>
      </section>
      <section class="content-section" id="travel">
        <div class="section-shell">
          <div class="detail-grid">
            <article class="detail-card"><span>Stay</span><strong>The Maison Hotel</strong><p>1407 Chartres Street. Guest breakfast begins at seven.</p><button class="button secondary" type="button" data-copy-hotel>Copy address</button></article>
            <article class="detail-card"><span>Ride</span><strong>Shuttles every 20 minutes</strong><p>Saturday service begins at 4:10 PM in the hotel courtyard.</p></article>
            <article class="detail-card"><span>Live note</span><strong>Courtyard ceremony confirmed</strong><p>The forecast is beautiful. No rain plan needed.</p></article>
          </div>
        </div>
      </section>
    `, '<a href="#schedule">Schedule</a><a href="#travel">Travel</a>'),

    "reception-companion": () => shell(`
      ${hero({
        kicker: "Dinner and dancing",
        names: "Dani & Luca",
        title: "Welcome to the reception.",
        date: "The Foundry Room · Saturday evening",
        copy: "Find your seat, meet your table, preview dinner, and add one song to the dance-floor queue.",
        actions: '<a class="button" href="#seat">Find my seat</a><a class="button secondary" href="#menu">Tonight’s menu</a>'
      })}
      <section class="content-section tint" id="seat">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">Seat finder</p><h2>Your place is<br><span class="script-line">waiting for you</span></h2></div>
            <p>Choose a guest name to see the table number, room, and a few familiar faces seated nearby.</p>
          </div>
          <div class="form-card">
            <label>Guest name<select data-seat><option value="">Choose a guest</option><option value="12|Garden Room|Avery, Jordan, and Mei">Taylor Morgan</option><option value="7|Courtyard|Sam, Ren, and Lou">Casey Lee</option><option value="3|Gallery|Nora, Ellis, and June">Jamie Rivera</option></select></label>
            <div class="seat-card" data-seat-card>
              <span class="table-number">—</span>
              <div><span class="mini-label">Your place</span><h3>Choose your name above</h3><p>We’ll show your table and tablemates.</p></div>
            </div>
          </div>
        </div>
      </section>
      <section class="content-section" id="menu">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">Dinner</p><h2>The menu tells<br><span class="script-line">a little story</span></h2></div>
            <p>Tap through the courses, then send one song request directly from your place at the table.</p>
          </div>
          <div class="tabs" role="tablist" aria-label="Dinner courses">
            <button class="tab active" role="tab" aria-selected="true" data-course="starter">Starter</button>
            <button class="tab" role="tab" aria-selected="false" data-course="dinner">Dinner</button>
            <button class="tab" role="tab" aria-selected="false" data-course="dessert">Dessert</button>
          </div>
          <article class="menu-card"><blockquote data-course-copy>Charred peach, burrata, basil oil, and toasted pistachio.</blockquote><cite data-course-note>A first bite of summer</cite></article>
          <form class="form-grid form-card" data-song-form style="margin-top:20px">
            <label>Your name<input required value="Taylor"></label>
            <label>Dance-floor request<input required value="September — Earth, Wind & Fire"></label>
            <button class="button wide" type="submit">Send song request</button>
          </form>
          <output data-song-status aria-live="polite"></output>
        </div>
      </section>
    `, '<a href="#seat">Seat finder</a><a href="#menu">Menu</a>'),

    "qr-guest": () => shell(`
      <section class="experience-hero">
        <div class="hero-inner">
          <p class="kicker">Place card scanned · Table 12</p>
          <h1 class="hero-names">Welcome, Taylor</h1>
          <h2 class="hero-title">Your tiny corner of Dani &amp; Luca’s reception.</h2>
          <p class="hero-copy">Everything for your table is ready—no app or sign-in required.</p>
          <div class="button-row"><a class="button" href="#guest-tools">Open guest tools</a></div>
        </div>
      </section>
      <section class="content-section tint" id="guest-tools">
        <div class="section-shell">
          <div class="phone-frame">
            <div class="phone-screen">
              <p class="kicker">Saturday · 7:42 PM</p>
              <h2 class="hero-names">Table 12</h2>
              <p>Garden Room · near the courtyard doors</p>
              <div class="tool-grid">
                <button class="tool" type="button" data-guest-tool="people"><span>01</span><strong>Meet the table</strong></button>
                <button class="tool" type="button" data-guest-tool="menu"><span>02</span><strong>Tonight’s menu</strong></button>
                <button class="tool" type="button" data-guest-tool="song"><span>03</span><strong>Request a song</strong></button>
                <button class="tool" type="button" data-guest-tool="note"><span>04</span><strong>Leave a note</strong></button>
              </div>
              <article class="note-card" data-guest-panel style="margin-top:16px"><blockquote>Tap a guest tool to open it here.</blockquote><cite>Made for this moment</cite></article>
            </div>
          </div>
        </div>
      </section>
    `, '<a href="#guest-tools">Guest tools</a>'),

    "memory-wall": () => shell(`
      ${hero({
        kicker: "The day, as everyone remembers it",
        names: "Cam & Riley",
        title: "A living wall of favorite moments.",
        date: "May 22, 2027 · Charleston",
        copy: "Photos, notes, inside jokes, and tiny moments contributed by the people who were there.",
        actions: '<a class="button" href="#memories">See the memories</a><button class="button secondary" type="button" data-open-memory>Add yours</button>'
      })}
      <section class="content-section tint" id="memories">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">From our favorite people</p><h2>The moments<br><span class="script-line">we almost missed</span></h2></div>
            <p>Add the moment you keep replaying, the photo you took from your seat, or the story we did not get to hear that night.</p>
          </div>
          <div class="memory-grid" data-memory-grid>
            <article class="memory"><span class="mini-label">First dance</span><p>“Not a dry eye at our table.”</p></article>
            <article class="memory"><span class="mini-label">Favorite surprise</span><p>“The brass band coming around the corner!”</p></article>
            <article class="memory"><span class="mini-label">From Aunt Jo</span><p>“The happiest kind of magic.”</p></article>
            <article class="memory"><span class="mini-label">Last song</span><p>“Every single person on the dance floor.”</p></article>
          </div>
          <div class="button-row"><button class="button" type="button" data-open-memory>Add a demo memory</button></div>
        </div>
      </section>
      <dialog data-memory-dialog>
        <div class="dialog-inner">
          <div class="dialog-head"><h2>Add your memory</h2><button class="icon-button" type="button" data-close-dialog aria-label="Close">×</button></div>
          <form class="form-grid" data-memory-form>
            <label>Your name<input required value="Taylor"></label>
            <label>Moment<input required value="The last song"></label>
            <label class="wide">Your memory<textarea required>Everyone pulled the couple into the middle of the dance floor.</textarea></label>
            <button class="button wide" type="submit">Add to the wall</button>
          </form>
          <output data-memory-status aria-live="polite"></output>
        </div>
      </dialog>
    `, '<a href="#memories">Memories</a><a href="#add" data-open-memory>Add yours</a>'),

    "thank-you": () => shell(`
      ${hero({
        kicker: "One more note from the newlyweds",
        names: "Elena & James",
        title: "Thank you for making our favorite day unforgettable.",
        date: "New Orleans · November 6, 2027",
        copy: "We made a few notes for the people who carried us through this celebration. Find yours below.",
        actions: '<a class="button" href="#your-note">Read your note</a><button class="button secondary" type="button" data-share-thanks>Share this thank-you</button>'
      })}
      <section class="content-section tint" id="your-note">
        <div class="section-shell">
          <div class="section-heading">
            <div><p class="kicker">A note made for you</p><h2>Gratitude,<br><span class="script-line">personally delivered</span></h2></div>
            <label>Your connection<select data-thank-group><option value="guest">Wedding guest</option><option value="family">Family</option><option value="party">Wedding party</option><option value="team">Vendor dream team</option></select></label>
          </div>
          <article class="note-card">
            <blockquote data-thank-copy>Our favorite day felt even more extraordinary because you were there to fill it with love.</blockquote>
            <cite data-thank-signature>With all our love, Elena &amp; James</cite>
          </article>
          <div class="button-row"><button class="button" type="button" data-share-thanks>Copy this personal note</button></div>
          <output data-thank-status aria-live="polite"></output>
        </div>
      </section>
      <section class="content-section" id="photos">
        <div class="section-shell">
          <div class="memory-grid">
            <article class="memory"><span class="mini-label">The courtyard</span><p>Welcome drinks beneath the lights.</p></article>
            <article class="memory"><span class="mini-label">The ceremony</span><p>Our people gathered close.</p></article>
            <article class="memory"><span class="mini-label">The second line</span><p>The whole street dancing with us.</p></article>
            <article class="memory"><span class="mini-label">The last song</span><p>Exactly where we wanted to be.</p></article>
          </div>
        </div>
      </section>
    `, '<a href="#your-note">Your note</a><a href="#photos">Photos</a>'),

    "anniversary": () => shell(`
      ${hero({
        kicker: "Our story keeps growing",
        names: "Leah & Morgan",
        title: "The wedding was chapter one.",
        date: "Est. September 4, 2027",
        copy: "A private digital keepsake for wedding memories, yearly traditions, favorite places, and every chapter after.",
        actions: '<a class="button" href="#timeline">Open our timeline</a><button class="button secondary" type="button" data-open-chapter>Add a chapter</button>'
      })}
      <section class="content-section tint" id="timeline">
        <div class="section-shell">
          <p class="kicker">Our years</p>
          <div class="year-nav" role="tablist" aria-label="Anniversary years" data-year-nav>
            <button class="tab active" role="tab" aria-selected="true" data-year="2027">2027</button>
            <button class="tab" role="tab" aria-selected="false" data-year="2028">2028</button>
            <button class="tab" role="tab" aria-selected="false" data-year="2029">2029</button>
          </div>
          <div class="year-story">
            <div class="year-art"><span data-year-art>2027</span></div>
            <div class="year-copy"><p class="kicker" data-year-label>Chapter one · The wedding</p><h2 data-year-title>Under the oak trees</h2><p data-year-story>We said yes beneath the oak trees and danced until the courtyard lights came on.</p></div>
          </div>
          <div class="button-row"><button class="button" type="button" data-open-chapter>Add the next chapter</button></div>
        </div>
      </section>
      <dialog data-chapter-dialog>
        <div class="dialog-inner">
          <div class="dialog-head"><h2>Add a chapter</h2><button class="icon-button" type="button" data-close-dialog aria-label="Close">×</button></div>
          <form class="form-grid" data-chapter-form>
            <label>Year<input required type="number" value="2030"></label>
            <label>Chapter title<input required value="A new little address"></label>
            <label class="wide">Memory<textarea required>We found the front porch where every future anniversary photo will begin.</textarea></label>
            <button class="button wide" type="submit">Add to our story</button>
          </form>
          <output data-chapter-status aria-live="polite"></output>
        </div>
      </dialog>
    `, '<a href="#timeline">Timeline</a><a href="#add" data-open-chapter>Add chapter</a>')
  };

  root.innerHTML = pages[key]();

  const setActive = (buttons, active) => {
    buttons.forEach((button) => {
      const selected = button === active;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", selected ? "true" : "false");
    });
  };

  const copyText = async (text, status, success) => {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = success;
    } catch {
      status.textContent = text;
    }
  };

  root.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });

  if (key === "save-the-date") {
    const wrap = root.querySelector("[data-envelope-wrap]");
    const status = root.querySelector("[data-status]");
    root.querySelector("[data-open-envelope]").addEventListener("click", (event) => {
      wrap.classList.toggle("open");
      event.currentTarget.textContent = wrap.classList.contains("open") ? "Close the envelope" : "Open the envelope";
      status.textContent = wrap.classList.contains("open") ? "The full announcement is open." : "";
    });
    root.querySelector("[data-calendar]").addEventListener("click", () => {
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Tiny Site Studios//Save the Date Demo//EN",
        "BEGIN:VEVENT", "UID:nora-ellis-2027@tinysitestudios.com", "DTSTAMP:20260731T000000Z",
        "DTSTART:20270918T230000Z", "DTEND:20270919T050000Z",
        "SUMMARY:Nora & Ellis Wedding", "LOCATION:La Mesita Ranch\\, Santa Fe\\, New Mexico",
        "DESCRIPTION:Save the date for Nora and Ellis.", "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "nora-and-ellis-save-the-date.ics";
      link.click();
      URL.revokeObjectURL(url);
      status.textContent = "Calendar file downloaded.";
    });
    root.querySelector("[data-share]").addEventListener("click", async () => {
      const data = { title: "Nora & Ellis", text: "Save the date: September 18, 2027 in Santa Fe.", url: window.location.href };
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch {
          status.textContent = "Share closed. Nothing was sent.";
        }
      } else {
        await copyText(`${data.text} ${data.url}`, status, "Share message copied.");
      }
    });
  }

  if (key === "digital-invitation") {
    const cover = root.querySelector("[data-invitation-cover]");
    root.querySelector("[data-enter-invitation]").addEventListener("click", () => cover.classList.add("dismissed"));
    const dialog = root.querySelector("[data-rsvp-dialog]");
    root.querySelectorAll("[data-open-rsvp]").forEach((button) => button.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.showModal();
    }));
    root.querySelector("[data-rsvp-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      root.querySelector("[data-rsvp-status]").textContent = "Response received. A confirmation has been prepared for Taylor.";
      event.currentTarget.querySelector("button").textContent = "Response sent";
    });
  }

  if (key === "bridal-shower") {
    const registryDialog = root.querySelector("[data-registry-dialog]");
    root.querySelector("[data-open-registry]").addEventListener("click", () => {
      registryDialog.showModal();
    });
    root.querySelectorAll("[data-registry-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelector("[data-registry-dialog-status]").textContent = `${button.dataset.registryChoice} selected. A real registry would continue to its secure checkout.`;
      });
    });
    root.querySelector("[data-recipe-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const recipe = event.currentTarget.querySelectorAll("input")[1].value;
      root.querySelector("[data-recipe-status]").textContent = `“${recipe}” has been added to Maya’s demo recipe book.`;
    });
  }

  const tripPlans = {
    fri: [["4:00 PM", "Casa Palma check-in", "Drop bags, claim rooms, and meet by the pool.", "House"], ["7:30 PM", "Dinner downtown", "Bright resort wear encouraged.", "Bar Cecil"]],
    sat: [["9:30 AM", "Canyon walk", "Water, sunscreen, and sneakers.", "Trailhead"], ["1:00 PM", "Pool afternoon", "Lunch arrives at the house.", "Casa Palma"], ["7:00 PM", "Group dinner", "The vote decides the final plan.", "TBD"]],
    sun: [["10:30 AM", "Slow brunch", "Coffee, photos, and one last toast.", "House"], ["1:00 PM", "Airport cars", "Shared rides leave from the driveway.", "Departure"]]
  };

  if (key === "celebration-weekend") {
    const itinerary = root.querySelector("[data-trip-itinerary]");
    const render = (day) => {
      itinerary.innerHTML = tripPlans[day].map(([time, title, copy, place]) => `<article class="timeline-item"><time>${time}</time><div><strong>${title}</strong><p>${copy}</p></div><em>${place}</em></article>`).join("");
    };
    render("fri");
    const dayButtons = [...root.querySelectorAll("[data-trip-day]")];
    dayButtons.forEach((button) => button.addEventListener("click", () => {
      setActive(dayButtons, button);
      render(button.dataset.tripDay);
    }));
    const counts = { tacos: 4, pool: 4 };
    root.querySelectorAll("[data-vote]").forEach((button) => button.addEventListener("click", () => {
      counts[button.dataset.vote] += 1;
      const total = counts.tacos + counts.pool;
      Object.keys(counts).forEach((name) => {
        root.querySelector(`[data-count="${name}"]`).textContent = counts[name];
        root.querySelector(`[data-meter="${name}"]`).style.setProperty("--value", `${Math.round(counts[name] / total * 100)}%`);
      });
      root.querySelector("[data-vote-status]").textContent = counts.tacos === counts.pool ? "The vote is tied." : `${counts.tacos > counts.pool ? "Desert tacos" : "Poolside dinner"} is leading.`;
    }));
    const packs = [...root.querySelectorAll("[data-pack]")];
    const updatePack = () => {
      const done = packs.filter((item) => item.checked).length;
      root.querySelector("[data-pack-status]").textContent = `${done} of ${packs.length} packed.`;
    };
    packs.forEach((item) => item.addEventListener("change", updatePack));
  }

  const guidePlans = {
    fri: [["6:30 PM", "Welcome drinks", "The Atrium · Garden casual", "Walk"], ["9:00 PM", "First shuttle", "Returns to The Maison Hotel.", "Ride"]],
    sat: [["4:10 PM", "Shuttles begin", "Meet in the hotel courtyard.", "Ride"], ["5:00 PM", "Ceremony", "The Glass House · Formal attire", "Main event"], ["6:00 PM", "Cocktails, dinner & dancing", "Courtyard doors open after vows.", "Celebrate"]],
    sun: [["10:00 AM", "Farewell brunch", "Drop in anytime before noon.", "The Maison"], ["12:15 PM", "Last airport shuttle", "Reserve at the front desk.", "Departure"]]
  };

  if (key === "weekend-guide") {
    const itinerary = root.querySelector("[data-guide-itinerary]");
    const render = (day) => {
      itinerary.innerHTML = guidePlans[day].map(([time, title, copy, tag]) => `<article class="timeline-item"><time>${time}</time><div><strong>${title}</strong><p>${copy}</p></div><em>${tag}</em></article>`).join("");
    };
    render("fri");
    const buttons = [...root.querySelectorAll("[data-guide-day]")];
    buttons.forEach((button) => button.addEventListener("click", () => {
      setActive(buttons, button);
      render(button.dataset.guideDay);
    }));
    root.querySelectorAll("[data-copy-hotel]").forEach((button) => button.addEventListener("click", () => {
      copyText("The Maison Hotel, 1407 Chartres Street, New Orleans", root.querySelector("[data-guide-status]"), "Hotel address copied.");
    }));
  }

  if (key === "reception-companion") {
    root.querySelector("[data-seat]").addEventListener("change", (event) => {
      const card = root.querySelector("[data-seat-card]");
      const number = card.querySelector(".table-number");
      const heading = card.querySelector("h3");
      const copy = card.querySelector("p");
      if (!event.target.value) {
        number.textContent = "—";
        heading.textContent = "Choose your name above";
        copy.textContent = "We’ll show your table and tablemates.";
        return;
      }
      const [table, room, people] = event.target.value.split("|");
      number.textContent = table;
      heading.textContent = `${room} · Table ${table}`;
      copy.textContent = `Seated with ${people}.`;
    });
    const courses = {
      starter: ["Charred peach, burrata, basil oil, and toasted pistachio.", "A first bite of summer"],
      dinner: ["Herb-roasted chicken or wild mushroom risotto with market vegetables.", "Choose at your place setting"],
      dessert: ["Brown-butter cake, blackberry jam, and late-night espresso.", "Plus a surprise after ten"]
    };
    const buttons = [...root.querySelectorAll("[data-course]")];
    buttons.forEach((button) => button.addEventListener("click", () => {
      setActive(buttons, button);
      const [copy, note] = courses[button.dataset.course];
      root.querySelector("[data-course-copy]").textContent = copy;
      root.querySelector("[data-course-note]").textContent = note;
    }));
    root.querySelector("[data-song-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const song = event.currentTarget.querySelectorAll("input")[1].value;
      root.querySelector("[data-song-status]").textContent = `“${song}” has joined the demo dance-floor queue.`;
    });
  }

  if (key === "qr-guest") {
    const panel = root.querySelector("[data-guest-panel]");
    const tools = {
      people: ["Avery is Luca’s college roommate. Jordan and Mei know Dani from the museum.", "Your tablemates"],
      menu: ["Burrata to start, chicken or mushroom risotto for dinner, and brown-butter cake.", "Tonight’s menu"],
      song: ["Your request has been added: “September” by Earth, Wind & Fire.", "Dance-floor request"],
      note: ["“The two of you make joy look effortless.” Your demo note is ready for the couple.", "Guest note"]
    };
    root.querySelectorAll("[data-guest-tool]").forEach((button) => button.addEventListener("click", () => {
      const [copy, label] = tools[button.dataset.guestTool];
      panel.innerHTML = `<blockquote>${copy}</blockquote><cite>${label}</cite>`;
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }));
  }

  if (key === "memory-wall") {
    const dialog = root.querySelector("[data-memory-dialog]");
    root.querySelectorAll("[data-open-memory]").forEach((button) => button.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.showModal();
    }));
    root.querySelector("[data-memory-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const values = [...event.currentTarget.querySelectorAll("input, textarea")].map((item) => item.value.replace(/[<>]/g, ""));
      const [name, moment, memory] = values;
      const card = document.createElement("article");
      card.className = "memory";
      card.innerHTML = `<span class="mini-label">${moment} · ${name}</span><p>“${memory}”</p>`;
      root.querySelector("[data-memory-grid]").prepend(card);
      root.querySelector("[data-memory-status]").textContent = "Your memory has been added to the demo wall.";
      setTimeout(() => dialog.close(), 900);
    });
  }

  if (key === "thank-you") {
    const notes = {
      guest: ["Our favorite day felt even more extraordinary because you were there to fill it with love.", "With all our love, Elena & James"],
      family: ["You taught us what lasting love looks like, then carried us all the way to this beautiful beginning.", "Your grateful newlyweds"],
      party: ["You kept us laughing, grounded, hydrated, and entirely ourselves through every moment.", "We could not have done it without you"],
      team: ["You turned a thousand moving pieces into a day that felt effortless, warm, and completely ours.", "With enormous gratitude"]
    };
    const select = root.querySelector("[data-thank-group]");
    select.addEventListener("change", () => {
      const [copy, signature] = notes[select.value];
      root.querySelector("[data-thank-copy]").textContent = copy;
      root.querySelector("[data-thank-signature]").textContent = signature;
    });
    root.querySelectorAll("[data-share-thanks]").forEach((button) => button.addEventListener("click", async () => {
      const text = `${root.querySelector("[data-thank-copy]").textContent} — ${root.querySelector("[data-thank-signature]").textContent}`;
      const status = root.querySelector("[data-thank-status]");
      if (navigator.share) {
        try {
          await navigator.share({ title: "A thank-you from Elena & James", text });
        } catch {
          status.textContent = "Share closed. Nothing was sent.";
        }
      } else {
        await copyText(text, status, "Personal thank-you copied.");
      }
    }));
  }

  if (key === "anniversary") {
    const stories = {
      2027: ["Chapter one · The wedding", "Under the oak trees", "We said yes beneath the oak trees and danced until the courtyard lights came on."],
      2028: ["Year one · A favorite tradition", "Back to New Orleans", "Beignets, our first anniversary toast, and the song from our first dance."],
      2029: ["Year two · Our family grew", "The drive home with Olive", "A tiny cabin, a long rainy hike, and the weekend we adopted Olive."]
    };
    const activateYear = (year, button) => {
      setActive([...root.querySelectorAll("[data-year]")], button);
      const [label, title, story] = stories[year];
      root.querySelector("[data-year-art]").textContent = year;
      root.querySelector("[data-year-label]").textContent = label;
      root.querySelector("[data-year-title]").textContent = title;
      root.querySelector("[data-year-story]").textContent = story;
    };
    root.querySelectorAll("[data-year]").forEach((button) => button.addEventListener("click", () => activateYear(button.dataset.year, button)));
    const dialog = root.querySelector("[data-chapter-dialog]");
    root.querySelectorAll("[data-open-chapter]").forEach((button) => button.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.showModal();
    }));
    root.querySelector("[data-chapter-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const [year, title, story] = [...event.currentTarget.querySelectorAll("input, textarea")].map((item) => item.value.replace(/[<>]/g, ""));
      stories[year] = [`${year} · A new chapter`, title, story];
      const button = document.createElement("button");
      button.className = "tab";
      button.type = "button";
      button.dataset.year = year;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", "false");
      button.textContent = year;
      button.addEventListener("click", () => activateYear(year, button));
      root.querySelector("[data-year-nav]").append(button);
      activateYear(year, button);
      root.querySelector("[data-chapter-status]").textContent = "The new chapter has been added to this demo timeline.";
      setTimeout(() => dialog.close(), 900);
    });
  }
})();
