(() => {
  const routes = {
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
    const route = routes[title];
    const link = card.querySelector(".experience-content .text-link");
    const preview = card.querySelector(".experience-preview");
    if (!route || !link || !preview) return;

    link.href = route;
    const isGuestbookLive = title === "Guestbook Live";
    link.innerHTML = isGuestbookLive ? 'Explore Guestbook Live <span aria-hidden="true">↗</span>' : 'Explore demo <span aria-hidden="true">↗</span>';
    link.setAttribute("aria-label", isGuestbookLive ? "Explore Guestbook Live" : `Explore the ${title} demo`);

    preview.tabIndex = 0;
    preview.setAttribute("role", "link");
    preview.setAttribute("aria-label", isGuestbookLive ? "Explore Guestbook Live" : `Explore the ${title} demo`);
    preview.addEventListener("click", () => {
      window.location.href = route;
    });
    preview.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = route;
      }
    });
  });
})();
