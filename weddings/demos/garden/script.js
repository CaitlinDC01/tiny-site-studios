(() => {
  const weddingDate = new Date("2027-05-22T17:00:00-04:00");
  const countdown = {
    days: document.querySelector('[data-countdown="days"]'),
    hours: document.querySelector('[data-countdown="hours"]'),
    minutes: document.querySelector('[data-countdown="minutes"]'),
  };

  const updateCountdown = () => {
    const remaining = Math.max(0, weddingDate.getTime() - Date.now());
    const totalMinutes = Math.floor(remaining / 60000);

    if (countdown.days) countdown.days.textContent = String(Math.floor(totalMinutes / 1440)).padStart(2, "0");
    if (countdown.hours) countdown.hours.textContent = String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, "0");
    if (countdown.minutes) countdown.minutes.textContent = String(totalMinutes % 60).padStart(2, "0");
  };

  updateCountdown();
  window.setInterval(updateCountdown, 60000);

  const form = document.querySelector("#rsvp-form");
  const confirmation = document.querySelector("#rsvp-confirmation");
  const attendingFields = [...document.querySelectorAll(".attending-fields")];
  const resetButton = document.querySelector("#reset-rsvp");

  const setAttendanceFields = (isAttending) => {
    attendingFields.forEach((field) => {
      field.hidden = !isAttending;
      field.querySelectorAll("input, select, textarea").forEach((control) => {
        control.disabled = !isAttending;
      });
    });
  };

  if (form && confirmation) {
    form.addEventListener("change", (event) => {
      if (event.target.name === "attendance") {
        setAttendanceFields(event.target.value === "yes");
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      form.hidden = true;
      confirmation.hidden = false;
      confirmation.setAttribute("tabindex", "-1");
      confirmation.focus();
    });
  }

  resetButton?.addEventListener("click", () => {
    form?.reset();
    setAttendanceFields(true);
    if (form) form.hidden = false;
    if (confirmation) confirmation.hidden = true;
    form?.querySelector("input")?.focus();
  });
})();
