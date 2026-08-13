(() => {
  const card = [...document.querySelectorAll(".experience-card")].find(
    (item) => item.querySelector("h4")?.textContent.trim() === "Memory Wall"
  );

  if (card) {
    const title = card.querySelector("h4");
    const monogram = card.querySelector(".preview-monogram");
    const caption = card.querySelector(".preview-caption");
    const description = card.querySelector(".experience-content > p:not(.experience-number)");
    const benefits = card.querySelectorAll(".benefit-list li");

    if (title) title.textContent = "Guestbook Live";
    if (monogram) monogram.textContent = "GL";
    if (caption) caption.textContent = "Guestbook Live";
    if (description) description.textContent = "A live, moderated collection of guest photos, videos, voice messages, and notes.";
    if (benefits[0]) benefits[0].textContent = "Every kind of memory";
    if (benefits[1]) benefits[1].textContent = "Made to revisit";
  }

  const aLaCarteCopy = document.querySelector(".alacarte > p");
  if (aLaCarteCopy) {
    aLaCarteCopy.textContent = "Save the dates, weekend guides, Guestbook Live, and every experience in the collection can be commissioned individually.";
  }
})();
