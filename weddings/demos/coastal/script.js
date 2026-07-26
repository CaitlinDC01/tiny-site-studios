(() => {
  const weddingDate = new Date("2027-10-07T19:00:00-05:00");
  const countdown = {
    days: document.querySelector('[data-countdown="days"]'),
    hours: document.querySelector('[data-countdown="hours"]'),
    minutes: document.querySelector('[data-countdown="minutes"]'),
  };

  const updateCountdown = () => {
    const remaining = Math.max(0, weddingDate.getTime() - Date.now());
    const totalMinutes = Math.floor(remaining / 60000);
    if (countdown.days) countdown.days.textContent = String(Math.floor(totalMinutes / 1440)).padStart(3, "0");
    if (countdown.hours) countdown.hours.textContent = String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, "0");
    if (countdown.minutes) countdown.minutes.textContent = String(totalMinutes % 60).padStart(2, "0");
  };

  updateCountdown();
  window.setInterval(updateCountdown, 60000);

  const tabs = [...document.querySelectorAll("[data-day]")];
  const events = [...document.querySelectorAll("[data-event-day]")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedDay = tab.dataset.day;
      tabs.forEach((button) => {
        const active = button === tab;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
      events.forEach((event) => {
        event.hidden = selectedDay !== "all" && event.dataset.eventDay !== selectedDay;
      });
    });
  });

  const toast = document.querySelector(".toast");
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2600);
  };

  document.querySelectorAll("[data-copy-button]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copyValue || button.parentElement?.querySelector("[data-copy-text]")?.textContent?.trim();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast("Address copied");
      } catch {
        showToast(text);
      }
    });
  });

  const storage = {
    get(key, fallback) {
      try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // The demo continues to work even when private browsing blocks storage.
      }
    },
  };

  const favoriteButtons = [...document.querySelectorAll("[data-favorite]")];
  const savedCount = document.querySelector("[data-saved-count]");
  let favorites = storage
    .get("tiny-sites-coastal-favorites", [])
    .filter((item) => favoriteButtons.some((button) => button.dataset.favorite === item));
  const renderFavorites = () => {
    favoriteButtons.forEach((button) => {
      const saved = favorites.includes(button.dataset.favorite);
      button.classList.toggle("saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      button.textContent = saved ? "♥" : "♡";
    });
    if (savedCount) savedCount.textContent = String(favorites.length);
  };

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const favorite = button.dataset.favorite;
      favorites = favorites.includes(favorite)
        ? favorites.filter((item) => item !== favorite)
        : [...favorites, favorite];
      storage.set("tiny-sites-coastal-favorites", favorites);
      renderFavorites();
      showToast(favorites.includes(favorite) ? `${favorite} saved` : `${favorite} removed`);
    });
  });
  renderFavorites();

  const packingItems = [...document.querySelectorAll("[data-pack-item]")];
  const packed = storage.get("tiny-sites-coastal-packing", []);
  packingItems.forEach((item) => {
    item.checked = packed.includes(item.dataset.packItem);
    item.addEventListener("change", () => {
      const selected = packingItems.filter((input) => input.checked).map((input) => input.dataset.packItem);
      storage.set("tiny-sites-coastal-packing", selected);
    });
  });

  const weekendMode = document.querySelector(".weekend-mode");
  const backdrop = document.querySelector(".mode-backdrop");
  const openButtons = [...document.querySelectorAll("[data-open-mode]")];
  const closeButtons = [...document.querySelectorAll("[data-close-mode]")];
  let lastFocused;

  const openMode = () => {
    if (!weekendMode || !backdrop) return;
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    weekendMode.classList.add("open");
    weekendMode.setAttribute("aria-hidden", "false");
    document.body.classList.add("mode-open");
    weekendMode.querySelector("[data-close-mode]")?.focus();
  };

  const closeMode = () => {
    if (!weekendMode || !backdrop) return;
    weekendMode.classList.remove("open");
    weekendMode.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.classList.remove("mode-open");
    lastFocused?.focus?.();
  };

  openButtons.forEach((button) => button.addEventListener("click", openMode));
  closeButtons.forEach((button) => button.addEventListener("click", closeMode));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && weekendMode?.classList.contains("open")) closeMode();
  });

  document.querySelectorAll("[data-demo-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Sample booking link");
    });
  });

  const memoryForm = document.querySelector("#memory-form");
  const memoryConfirmation = document.querySelector("#memory-confirmation");
  const resetMemory = document.querySelector("#reset-memory");

  memoryForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!memoryForm.checkValidity()) {
      memoryForm.reportValidity();
      return;
    }
    memoryForm.hidden = true;
    memoryConfirmation.hidden = false;
    memoryConfirmation.setAttribute("tabindex", "-1");
    memoryConfirmation.focus();
  });

  resetMemory?.addEventListener("click", () => {
    memoryForm?.reset();
    if (memoryForm) memoryForm.hidden = false;
    if (memoryConfirmation) memoryConfirmation.hidden = true;
    memoryForm?.querySelector("input")?.focus();
  });
})();
