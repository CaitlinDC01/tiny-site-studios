(() => {
  const weddingDate = new Date("2027-10-04T17:00:00-05:00");
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

  const roleButtons = [...document.querySelectorAll("[data-role-button]")];
  const rolePanels = [...document.querySelectorAll("[data-role-panel]")];
  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      roleButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle("active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      rolePanels.forEach((panel) => {
        const selected = panel.dataset.rolePanel === button.dataset.roleButton;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
      document.querySelector(".role-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  const dayButtons = [...document.querySelectorAll("[data-day-button]")];
  const events = [...document.querySelectorAll("[data-event-day]")];
  dayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const day = button.dataset.dayButton;
      dayButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle("active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      events.forEach((event) => {
        event.hidden = day !== "all" && event.dataset.eventDay !== day;
      });
    });
  });

  const readyButtons = [...document.querySelectorAll("[data-ready-button]")];
  const readyPanels = [...document.querySelectorAll("[data-ready-panel]")];
  readyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      readyButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle("active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      readyPanels.forEach((panel) => {
        const selected = panel.dataset.readyPanel === button.dataset.readyButton;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
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
    }, 2500);
  };

  document.querySelectorAll("[data-copy-button]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copyValue || button.parentElement?.querySelector("[data-copy-text]")?.textContent?.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        showToast("Address copied");
      } catch {
        showToast(value);
      }
    });
  });

  const songButtons = [...document.querySelectorAll("[data-song]")];
  const voteStatus = document.querySelector("[data-vote-status]");
  songButtons.forEach((button) => {
    button.addEventListener("click", () => {
      songButtons.forEach((candidate) => candidate.classList.toggle("selected", candidate === button));
      if (voteStatus) voteStatus.textContent = `Sample vote saved: ${button.dataset.song}`;
      showToast("Sample song vote saved");
    });
  });
})();
