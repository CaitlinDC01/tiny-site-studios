const stages = ["Consult", "Pre-approved", "Home search", "Offer", "Under contract", "Inspection", "Closing"];
let currentView = "agent";
let currentStage = 4;

function showView(view) {
  currentView = view;
  document.querySelector("#agent-view").hidden = view !== "agent";
  document.querySelector("#client-view").hidden = view !== "client";
  document.querySelectorAll(".mode button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.querySelector("#flip-view").textContent = `See the ${view === "agent" ? "client experience" : "agent dashboard"} →`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setStage(index) {
  currentStage = index;
  document.querySelector("#stage-title").textContent = stages[index];
  document.querySelector("#client-stage-title").textContent = stages[index];
  document.querySelector("#plain-stage").textContent = stages[index];
  document.querySelector("#stage-count").textContent = `${index + 1} of ${stages.length}`;
  document.querySelector("#client-stage-count").textContent = `${index + 1} of ${stages.length}`;
  document.querySelector("#progress-bar").style.width = `${((index + 1) / stages.length) * 100}%`;
  document.querySelectorAll(".stage-list button").forEach((button, itemIndex) => {
    button.classList.toggle("done", itemIndex < index);
    button.classList.toggle("current", itemIndex === index);
    button.querySelector("span").textContent = itemIndex < index ? "✓" : itemIndex + 1;
  });
  document.querySelectorAll("#client-progress > div").forEach((item, itemIndex) => {
    item.classList.toggle("done", itemIndex < index);
    item.classList.toggle("current", itemIndex === index);
    item.querySelector("span").textContent = itemIndex < index ? "✓" : itemIndex + 1;
  });
}

document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
document.querySelector("#flip-view").addEventListener("click", () => showView(currentView === "agent" ? "client" : "agent"));
document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => setStage(Number(button.dataset.stage))));
document.querySelector("#save").addEventListener("click", () => { const saved = document.querySelector("#saved"); saved.classList.add("show"); window.setTimeout(() => saved.classList.remove("show"), 2200); });
document.querySelector("#upload").addEventListener("click", (event) => { event.currentTarget.textContent = "✓ Sample upload complete"; });
document.querySelector("#send").addEventListener("click", () => { const input = document.querySelector("#question"); if (!input.value.trim()) return; input.value = ""; document.querySelector("#sent").hidden = false; });
