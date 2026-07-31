(() => {
  const key = document.body.dataset.demo;
  const root = document.querySelector("#demo-root");
  if (!root) return;

  const demos = {
    "save-the-date": {
      stage: "Before the wedding",
      type: "Save the Date",
      eyebrow: "A first glimpse",
      title: "The date is set.",
      script: "come celebrate with us",
      lede: "A shareable announcement that feels personal from the very first tap—beautifully branded, animated, and always easy to find.",
      names: "Nora & Ellis",
      meta: ["Animated reveal", "Calendar ready", "Made to share"],
      features: [
        "Sets the visual tone before invitations or the full wedding website launch.",
        "Gives guests the essential date and location in one memorable moment.",
        "Can add the celebration to a guest’s calendar without another attachment."
      ]
    },
    "digital-invitation": {
      stage: "Before the wedding",
      type: "Digital Invitation",
      eyebrow: "An invitation with pacing",
      title: "Open something beautiful.",
      script: "made just for your people",
      lede: "A layered digital invitation with a considered reveal, event details, and a graceful path to respond.",
      names: "Ari & Simone",
      meta: ["Guided reveal", "Event details", "RSVP moment"],
      features: [
        "Turns opening the invitation into a small, intentional experience.",
        "Keeps the invitation, details, and response path beautifully coordinated.",
        "Adapts cleanly to phones while preserving the couple’s signature style."
      ]
    },
    "bridal-shower": {
      stage: "Before the wedding",
      type: "Bridal Shower",
      eyebrow: "A gathering guide",
      title: "A lovely afternoon, organized.",
      script: "for the people celebrating her",
      lede: "A polished home for the invitation, schedule, registry, host notes, and the little activities that make the shower feel personal.",
      names: "Maya’s Shower",
      meta: ["Event details", "Registry links", "Guest activities"],
      features: [
        "Gives hosts one elegant place to share every practical detail.",
        "Keeps registry links, themes, and guest activities from getting lost in messages.",
        "Creates a coordinated experience that can match the wider wedding brand."
      ]
    },
    "celebration-weekend": {
      stage: "Before the wedding",
      type: "Celebration Weekend",
      eyebrow: "Plans for the whole group",
      title: "One trip. Zero group-chat chaos.",
      script: "every plan in one place",
      lede: "A lively hub for a bachelor, bachelorette, or combined getaway—with plans, preferences, packing notes, and quick group decisions.",
      names: "Palm Springs Crew",
      meta: ["Shared itinerary", "Group voting", "Packing notes"],
      features: [
        "Turns scattered confirmations and screenshots into one reliable itinerary.",
        "Makes quick group decisions feel easy with lightweight polls and preferences.",
        "Keeps addresses, dress notes, and timing mobile-friendly for everyone."
      ]
    },
    "weekend-guide": {
      stage: "Wedding weekend",
      type: "Weekend Guide",
      eyebrow: "The weekend in your pocket",
      title: "Know where to be. Enjoy being there.",
      script: "the easy little itinerary",
      lede: "A calm, at-a-glance guide to every gathering, address, dress note, shuttle time, and last-minute update.",
      names: "Jo & Ren’s Weekend",
      meta: ["Day-by-day plans", "Live notes", "Quick directions"],
      features: [
        "Lets guests see the right information for the right day without searching.",
        "Pairs every event with useful context such as attire, transportation, and timing.",
        "Creates a natural home for small updates when plans shift."
      ]
    },
    "reception-companion": {
      stage: "Wedding weekend",
      type: "Reception Companion",
      eyebrow: "A thoughtful seat-side experience",
      title: "Dinner, stories, and small surprises.",
      script: "the reception, reimagined",
      lede: "A digital companion for table assignments, menus, speeches, song requests, and the meaningful details guests might otherwise miss.",
      names: "Dani & Luca",
      meta: ["Seat finder", "Menu stories", "Guest requests"],
      features: [
        "Helps guests find their place quickly without printed seating-chart congestion.",
        "Adds context to the meal, wedding party, speeches, and traditions.",
        "Invites guests into small interactive moments without distracting from the celebration."
      ]
    },
    "qr-guest": {
      stage: "Wedding weekend",
      type: "QR Guest Experience",
      eyebrow: "One scan, a whole experience",
      title: "A tiny doorway for every guest.",
      script: "scan into the celebration",
      lede: "A branded mobile experience opened from signage, a place card, or the table—showing exactly what guests need in that moment.",
      names: "Table Twelve",
      meta: ["Instant access", "Context aware", "No app required"],
      features: [
        "Opens instantly from printed signage without an app download or account.",
        "Can show table-specific, event-specific, or time-sensitive information.",
        "Creates a memorable interactive layer while keeping printed materials minimal."
      ]
    },
    "memory-wall": {
      stage: "After the wedding",
      type: "Memory Wall",
      eyebrow: "A living keepsake",
      title: "Every favorite moment, together.",
      script: "made by the people you love",
      lede: "A warm, growing collection of photos, notes, inside jokes, and favorite memories contributed by the people who were there.",
      names: "Cam & Riley",
      meta: ["Guest memories", "Photo moments", "Made to revisit"],
      features: [
        "Gathers guest perspectives that the couple could never capture alone.",
        "Combines photos and written memories into a more personal keepsake.",
        "Creates a place to revisit the celebration long after the gallery is delivered."
      ]
    },
    "thank-you": {
      stage: "After the wedding",
      type: "Thank You Site",
      eyebrow: "Gratitude, personally delivered",
      title: "Thank you can feel this special.",
      script: "a note made for each of you",
      lede: "A beautifully shareable thank-you experience with personal messages for family, friends, the wedding party, and everyone who made the day possible.",
      names: "Elena & James",
      meta: ["Personal messages", "Favorite photos", "Easy to share"],
      features: [
        "Makes gratitude feel as considered and personal as the celebration itself.",
        "Can tailor messages for different groups while keeping one coordinated design.",
        "Pairs heartfelt notes with favorite moments instead of another generic email."
      ]
    },
    "anniversary": {
      stage: "After the wedding",
      type: "Anniversary Site",
      eyebrow: "A story that keeps growing",
      title: "The wedding was chapter one.",
      script: "here’s to every year after",
      lede: "A small digital keepsake that holds the wedding story and grows with favorite places, milestones, traditions, and new chapters.",
      names: "Leah & Morgan",
      meta: ["Growing timeline", "Yearly traditions", "Lasting home"],
      features: [
        "Gives the wedding story a lasting home instead of letting it disappear into an archive.",
        "Adds new milestones, travels, and traditions one anniversary at a time.",
        "Becomes a thoughtful private keepsake or a page shared with family and friends."
      ]
    }
  };

  const demo = demos[key];
  if (!demo) {
    root.innerHTML = "<p>Demo not found.</p>";
    return;
  }

  const panels = {
    "save-the-date": `
      <p class="mini-label">Tap to open the announcement</p>
      <div class="reveal-card" data-reveal-card>
        <div class="reveal-inner">
          <b>Nora &amp; Ellis</b>
          <small>September 18, 2027 · Santa Fe</small>
        </div>
      </div>
      <div class="action-row">
        <button class="button" type="button" data-reveal>Open the save the date</button>
        <button class="button secondary" type="button" data-calendar>Add to calendar</button>
      </div>
      <output data-output aria-live="polite"></output>
    `,
    "digital-invitation": `
      <div class="tab-row" role="tablist" aria-label="Invitation sections">
        <button class="tab active" role="tab" aria-selected="true" data-tab="invite">Invitation</button>
        <button class="tab" role="tab" aria-selected="false" data-tab="details">Details</button>
        <button class="tab" role="tab" aria-selected="false" data-tab="respond">Respond</button>
      </div>
      <div class="demo-view" data-view="invite">
        <div class="message-card"><blockquote>Together with their families, Ari &amp; Simone invite you to celebrate.</blockquote><cite>October 2, 2027 · Brooklyn</cite></div>
      </div>
      <div class="demo-view" data-view="details" hidden>
        <div class="detail-grid">
          <div class="detail-card"><span class="mini-label">Ceremony</span><strong>5:30 PM</strong><p>The Foundry · Long Island City</p></div>
          <div class="detail-card"><span class="mini-label">Attire</span><strong>Creative formal</strong><p>Color and personal style encouraged.</p></div>
        </div>
      </div>
      <div class="demo-view" data-view="respond" hidden>
        <form class="form-grid" data-demo-form>
          <label>Name<input required value="Taylor Morgan"></label>
          <label>Response<select><option>Joyfully accepts</option><option>Regretfully declines</option></select></label>
          <button class="button wide" type="submit">Send demo RSVP</button>
        </form>
        <output data-output aria-live="polite"></output>
      </div>
    `,
    "bridal-shower": `
      <div class="detail-grid">
        <div class="detail-card"><span class="mini-label">When</span><strong>Sunday, May 16 · 1 PM</strong><p>Lunch, games, and a little garden sparkle.</p></div>
        <div class="detail-card"><span class="mini-label">Where</span><strong>The Conservatory</strong><p>42 Linden Lane · Dallas</p></div>
      </div>
      <p class="mini-label" style="margin-top:22px">What would you like to explore?</p>
      <div class="action-row">
        <button class="chip active" type="button" data-shower="schedule">The afternoon</button>
        <button class="chip" type="button" data-shower="registry">Registry</button>
        <button class="chip" type="button" data-shower="recipe">Recipe cards</button>
      </div>
      <div class="message-card" data-shower-result><blockquote>Lunch at one, a “how well do you know Maya?” game, then gifts and cake.</blockquote><cite>Come ready to celebrate</cite></div>
    `,
    "celebration-weekend": `
      <div class="tab-row" role="tablist" aria-label="Trip days">
        <button class="tab active" role="tab" aria-selected="true" data-day="fri">Friday</button>
        <button class="tab" role="tab" aria-selected="false" data-day="sat">Saturday</button>
        <button class="tab" role="tab" aria-selected="false" data-day="sun">Sunday</button>
      </div>
      <div class="timeline" data-itinerary></div>
      <p class="mini-label" style="margin-top:22px">Saturday dinner vote</p>
      <div class="action-row">
        <button class="chip" type="button" data-vote="tacos">Desert tacos</button>
        <button class="chip" type="button" data-vote="pool">Poolside dinner</button>
      </div>
      <div class="meter" aria-label="Current dinner vote"><span data-vote-meter style="--value:50%"></span></div>
      <output data-output aria-live="polite">The vote is tied—make the deciding pick.</output>
    `,
    "weekend-guide": `
      <div class="tab-row" role="tablist" aria-label="Wedding weekend days">
        <button class="tab active" role="tab" aria-selected="true" data-day="fri">Friday</button>
        <button class="tab" role="tab" aria-selected="false" data-day="sat">Saturday</button>
        <button class="tab" role="tab" aria-selected="false" data-day="sun">Sunday</button>
      </div>
      <div class="timeline" data-itinerary></div>
      <div class="action-row">
        <button class="button secondary" type="button" data-copy-address>Copy hotel address</button>
      </div>
      <output data-output aria-live="polite"></output>
    `,
    "reception-companion": `
      <label>Find your seat
        <select data-seat>
          <option value="">Choose a guest</option>
          <option value="12|Garden Room|Avery, Jordan & Mei">Taylor Morgan</option>
          <option value="7|Courtyard|Sam, Ren & Lou">Casey Lee</option>
          <option value="3|Gallery|Nora, Ellis & June">Jamie Rivera</option>
        </select>
      </label>
      <div class="seat-result" data-seat-result>
        <span class="table-number">—</span>
        <div><span class="mini-label">Your place</span><strong>Choose your name above</strong><p>We’ll show your table and a few familiar faces.</p></div>
      </div>
      <div class="tab-row" role="tablist" aria-label="Reception details">
        <button class="tab active" role="tab" aria-selected="true" data-menu="starter">Starter</button>
        <button class="tab" role="tab" aria-selected="false" data-menu="dinner">Dinner</button>
        <button class="tab" role="tab" aria-selected="false" data-menu="dessert">Dessert</button>
      </div>
      <div class="message-card" data-menu-result><blockquote>Charred peach, burrata, basil oil, and toasted pistachio.</blockquote><cite>A first bite of summer</cite></div>
    `,
    "qr-guest": `
      <p class="mini-label">A QR code could live on a place card, sign, or welcome bag</p>
      <div class="qr-frame"><span>Table 12</span></div>
      <div class="action-row" style="justify-content:center">
        <button class="button" type="button" data-scan>Simulate scan</button>
      </div>
      <div class="seat-result" data-qr-result hidden>
        <span class="table-number">12</span>
        <div><span class="mini-label">Welcome, Taylor</span><strong>Your table’s little corner</strong><p>Meet your tablemates, request a song, read the menu, and leave a note for the couple.</p></div>
      </div>
    `,
    "memory-wall": `
      <p class="mini-label">Notes and snapshots from the people who were there</p>
      <div class="memory-grid" data-memory-grid>
        <article class="memory-card"><span class="mini-label">First dance</span><p>“Not a dry eye at our table.”</p></article>
        <article class="memory-card"><span class="mini-label">Favorite moment</span><p>“The surprise brass band!”</p></article>
        <article class="memory-card"><span class="mini-label">From Aunt Jo</span><p>“The happiest kind of magic.”</p></article>
      </div>
      <form class="form-grid" data-memory-form>
        <label>Your name<input required value="Taylor"></label>
        <label class="wide">Favorite memory<textarea required>That last song with everyone on the dance floor.</textarea></label>
        <button class="button wide" type="submit">Add demo memory</button>
      </form>
      <output data-output aria-live="polite"></output>
    `,
    "thank-you": `
      <label>Choose a note
        <select data-recipient>
          <option value="everyone">For every guest</option>
          <option value="family">For our families</option>
          <option value="party">For our wedding party</option>
          <option value="vendors">For the dream team</option>
        </select>
      </label>
      <div class="message-card">
        <blockquote data-thank-message>Our favorite day felt even more extraordinary because you were there to fill it with love.</blockquote>
        <cite data-thank-signature>With all our love, Elena &amp; James</cite>
      </div>
      <div class="action-row">
        <button class="button secondary" type="button" data-share>Copy share message</button>
      </div>
      <output data-output aria-live="polite"></output>
    `,
    "anniversary": `
      <div class="tab-row" role="tablist" aria-label="Anniversary chapters">
        <button class="tab active" role="tab" aria-selected="true" data-year="2027">2027</button>
        <button class="tab" role="tab" aria-selected="false" data-year="2028">2028</button>
        <button class="tab" role="tab" aria-selected="false" data-year="2029">2029</button>
      </div>
      <div class="message-card">
        <blockquote data-year-story>We said yes beneath the oak trees and danced until the courtyard lights came on.</blockquote>
        <cite data-year-label>Chapter one · The wedding</cite>
      </div>
      <form class="form-grid" data-anniversary-form>
        <label>Year<input required type="number" value="2030"></label>
        <label>Chapter<input required value="A new little address"></label>
        <label class="wide">Memory<textarea required>We found the front porch where every future anniversary photo will begin.</textarea></label>
        <button class="button wide" type="submit">Add demo chapter</button>
      </form>
      <output data-output aria-live="polite"></output>
    `
  };

  root.innerHTML = `
    <div class="demo-note">Fictional interactive concept by Tiny Site Studios</div>
    <div class="demo-shell">
      <nav class="demo-nav" aria-label="Demo navigation">
        <a class="back-link" href="../../#experiences">← Wedding collection</a>
        <span>${demo.stage}</span>
        <a class="button" href="https://forms.gle/LHubEz2hcxd3kshz9" target="_blank" rel="noopener">Imagine yours</a>
      </nav>
      <main>
        <section class="demo-hero">
          <div class="demo-copy">
            <p class="eyebrow">${demo.eyebrow}</p>
            <h1>${demo.title}<span class="script">${demo.script}</span></h1>
            <p class="lede">${demo.lede}</p>
            <div class="hero-meta">${demo.meta.map((item) => `<span>${item}</span>`).join("")}</div>
          </div>
          <div class="demo-stage">
            <div class="stage-label"><span>${demo.type}</span><span>Interactive preview</span></div>
            <div class="experience-window">
              <div class="window-head"><strong>${demo.names}</strong><span>Tiny experience</span></div>
              <div class="demo-panel">${panels[key]}</div>
            </div>
          </div>
        </section>
        <section class="demo-explainer">
          <div>
            <p class="eyebrow">What this experience does</p>
            <h2>Small format.<br><span class="script">meaningful impact</span></h2>
          </div>
          <ol class="benefit-list">
            ${demo.features.map((feature, index) => `<li><span>0${index + 1}</span>${feature}</li>`).join("")}
          </ol>
        </section>
      </main>
      <footer class="demo-footer">
        <div><strong>Made around your story.</strong><p>This is one fictional direction. Your experience would be designed from scratch.</p></div>
        <a class="button" href="../../#experiences">Explore every offering</a>
      </footer>
    </div>
  `;

  const output = root.querySelector("[data-output]");

  const activateTabs = (selector, viewAttribute) => {
    root.querySelectorAll(selector).forEach((tab) => {
      tab.addEventListener("click", () => {
        root.querySelectorAll(selector).forEach((item) => {
          item.classList.toggle("active", item === tab);
          item.setAttribute("aria-selected", item === tab ? "true" : "false");
        });
        root.querySelectorAll(`[${viewAttribute}]`).forEach((view) => {
          view.hidden = view.getAttribute(viewAttribute) !== tab.dataset.tab;
        });
      });
    });
  };

  if (key === "save-the-date") {
    root.querySelector("[data-reveal]").addEventListener("click", (event) => {
      const card = root.querySelector("[data-reveal-card]");
      card.classList.toggle("open");
      event.currentTarget.textContent = card.classList.contains("open") ? "Close the save the date" : "Open the save the date";
    });
    root.querySelector("[data-calendar]").addEventListener("click", () => {
      output.textContent = "September 18, 2027 has been added to this fictional guest’s calendar.";
    });
  }

  if (key === "digital-invitation") {
    activateTabs("[data-tab]", "data-view");
    root.querySelector("[data-demo-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      output.textContent = "Your demo response has been received beautifully.";
    });
  }

  if (key === "bridal-shower") {
    const copy = {
      schedule: ["Lunch at one, a “how well do you know Maya?” game, then gifts and cake.", "Come ready to celebrate"],
      registry: ["Maya and Devin are registered at Heath Ceramics, Food52, and a local honeymoon fund.", "Three thoughtful places to choose from"],
      recipe: ["Bring one favorite recipe—handwritten, inherited, or invented—to add to Maya’s new kitchen book.", "A keepsake made by everyone"]
    };
    root.querySelectorAll("[data-shower]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-shower]").forEach((item) => item.classList.toggle("active", item === button));
        const [quote, cite] = copy[button.dataset.shower];
        root.querySelector("[data-shower-result]").innerHTML = `<blockquote>${quote}</blockquote><cite>${cite}</cite>`;
      });
    });
  }

  const itineraries = {
    "celebration-weekend": {
      fri: [["4:00 PM", "Pool house check-in", "Drop bags, claim rooms, and meet outside."], ["7:30 PM", "Dinner downtown", "Colorful resort wear encouraged."]],
      sat: [["10:00 AM", "Desert adventure", "Water, sunscreen, and sneakers."], ["7:00 PM", "The group dinner", "Vote for the final plan below."]],
      sun: [["10:30 AM", "Slow brunch", "Coffee, photos, and one last toast."], ["1:00 PM", "Airport run", "Shared cars leave from the house."]]
    },
    "weekend-guide": {
      fri: [["6:30 PM", "Welcome drinks", "The Atrium · Garden casual"], ["9:00 PM", "Shuttle return", "First loop to the hotel."]],
      sat: [["4:15 PM", "Ceremony shuttles", "Meet in the hotel lobby."], ["5:00 PM", "Ceremony", "The Glass House · Formal attire"], ["6:00 PM", "Dinner & dancing", "Cocktails begin in the courtyard."]],
      sun: [["10:00 AM", "Farewell brunch", "Drop in anytime before noon."], ["12:15 PM", "Last airport shuttle", "Reserve your seat at the desk."]]
    }
  };

  if (itineraries[key]) {
    const renderItinerary = (day) => {
      root.querySelector("[data-itinerary]").innerHTML = itineraries[key][day]
        .map(([time, title, copy]) => `<article class="timeline-item"><span class="mini-label">${time}</span><strong>${title}</strong><p>${copy}</p></article>`)
        .join("");
    };
    renderItinerary("fri");
    root.querySelectorAll("[data-day]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-day]").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-selected", item === button ? "true" : "false");
        });
        renderItinerary(button.dataset.day);
      });
    });
  }

  if (key === "celebration-weekend") {
    let tacos = 4;
    let pool = 4;
    root.querySelectorAll("[data-vote]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.vote === "tacos") tacos += 1;
        else pool += 1;
        const percent = Math.round((tacos / (tacos + pool)) * 100);
        root.querySelector("[data-vote-meter]").style.setProperty("--value", `${percent}%`);
        output.textContent = `Desert tacos ${tacos} · Poolside dinner ${pool}`;
      });
    });
  }

  if (key === "weekend-guide") {
    root.querySelector("[data-copy-address]").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("The Maison Hotel, 1407 Chartres Street, New Orleans");
        output.textContent = "Hotel address copied.";
      } catch {
        output.textContent = "The Maison Hotel · 1407 Chartres Street · New Orleans";
      }
    });
  }

  if (key === "reception-companion") {
    root.querySelector("[data-seat]").addEventListener("change", (event) => {
      const result = root.querySelector("[data-seat-result]");
      if (!event.target.value) {
        result.querySelector(".table-number").textContent = "—";
        result.querySelector("strong").textContent = "Choose your name above";
        result.querySelector("p").textContent = "We’ll show your table and a few familiar faces.";
        return;
      }
      const [number, room, friends] = event.target.value.split("|");
      result.querySelector(".table-number").textContent = number;
      result.querySelector("strong").textContent = `${room} · Table ${number}`;
      result.querySelector("p").textContent = `Seated with ${friends}.`;
    });
    const menus = {
      starter: ["Charred peach, burrata, basil oil, and toasted pistachio.", "A first bite of summer"],
      dinner: ["Herb-roasted chicken or wild mushroom risotto with market vegetables.", "Choose at your place setting"],
      dessert: ["Brown-butter cake, blackberry jam, and late-night espresso.", "Plus a surprise after ten"]
    };
    root.querySelectorAll("[data-menu]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-menu]").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-selected", item === button ? "true" : "false");
        });
        const [quote, cite] = menus[button.dataset.menu];
        root.querySelector("[data-menu-result]").innerHTML = `<blockquote>${quote}</blockquote><cite>${cite}</cite>`;
      });
    });
  }

  if (key === "qr-guest") {
    root.querySelector("[data-scan]").addEventListener("click", (event) => {
      const result = root.querySelector("[data-qr-result]");
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      event.currentTarget.textContent = "Guest experience opened";
    });
  }

  if (key === "memory-wall") {
    root.querySelector("[data-memory-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = event.currentTarget.querySelector("input").value.replace(/[<>]/g, "");
      const note = event.currentTarget.querySelector("textarea").value.replace(/[<>]/g, "");
      const card = document.createElement("article");
      card.className = "memory-card";
      card.innerHTML = `<span class="mini-label">From ${name}</span><p>“${note}”</p>`;
      root.querySelector("[data-memory-grid]").prepend(card);
      output.textContent = "Your demo memory has joined the wall.";
    });
  }

  if (key === "thank-you") {
    const notes = {
      everyone: ["Our favorite day felt even more extraordinary because you were there to fill it with love.", "With all our love, Elena & James"],
      family: ["You taught us what lasting love looks like, then carried us all the way to this beautiful beginning.", "Your grateful newlyweds"],
      party: ["You kept us laughing, grounded, hydrated, and entirely ourselves through every moment.", "We could not have done it without you"],
      vendors: ["You turned a thousand moving pieces into a day that felt effortless, warm, and completely ours.", "With enormous gratitude"]
    };
    root.querySelector("[data-recipient]").addEventListener("change", (event) => {
      const [message, signature] = notes[event.target.value];
      root.querySelector("[data-thank-message]").textContent = message;
      root.querySelector("[data-thank-signature]").textContent = signature;
    });
    root.querySelector("[data-share]").addEventListener("click", async () => {
      const text = `${root.querySelector("[data-thank-message]").textContent} — ${root.querySelector("[data-thank-signature]").textContent}`;
      try {
        await navigator.clipboard.writeText(text);
        output.textContent = "The thank-you message is ready to share.";
      } catch {
        output.textContent = "Your personal thank-you is ready to send.";
      }
    });
  }

  if (key === "anniversary") {
    const stories = {
      2027: ["We said yes beneath the oak trees and danced until the courtyard lights came on.", "Chapter one · The wedding"],
      2028: ["Back to New Orleans for beignets, our first anniversary toast, and the song from our first dance.", "Year one · A favorite tradition"],
      2029: ["A tiny cabin, a long rainy hike, and the weekend we adopted Olive on the drive home.", "Year two · Our family grew"]
    };
    root.querySelectorAll("[data-year]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-year]").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-selected", item === button ? "true" : "false");
        });
        const [story, label] = stories[button.dataset.year];
        root.querySelector("[data-year-story]").textContent = story;
        root.querySelector("[data-year-label]").textContent = label;
      });
    });
    root.querySelector("[data-anniversary-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const values = [...event.currentTarget.querySelectorAll("input, textarea")].map((item) => item.value.replace(/[<>]/g, ""));
      const [year, chapter, story] = values;
      stories[year] = [story, `${year} · ${chapter}`];
      const button = document.createElement("button");
      button.className = "tab";
      button.type = "button";
      button.dataset.year = year;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", "false");
      button.textContent = year;
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-year]").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-selected", item === button ? "true" : "false");
        });
        root.querySelector("[data-year-story]").textContent = story;
        root.querySelector("[data-year-label]").textContent = `${year} · ${chapter}`;
      });
      root.querySelector(".tab-row").append(button);
      button.click();
      output.textContent = "A new anniversary chapter has been added to this demo.";
    });
  }
})();
