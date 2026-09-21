const weddingDate=new Date("2027-04-24T17:00:00-04:00");
function updateCountdown(){const remaining=Math.max(0,weddingDate-Date.now());document.querySelector("[data-days]").textContent=String(Math.floor(remaining/86400000)).padStart(3,"0");document.querySelector("[data-hours]").textContent=String(Math.floor(remaining/3600000)%24).padStart(2,"0");document.querySelector("[data-minutes]").textContent=String(Math.floor(remaining/60000)%60).padStart(2,"0")}
updateCountdown();setInterval(updateCountdown,60000);
const header=document.querySelector(".site-header");const navButton=document.querySelector(".nav-button");navButton.addEventListener("click",()=>{const open=header.classList.toggle("open");navButton.setAttribute("aria-expanded",String(open))});
header.querySelectorAll("nav a").forEach(link=>link.addEventListener("click",()=>{header.classList.remove("open");navButton.setAttribute("aria-expanded","false")}));
document.querySelectorAll("[data-demo-link]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();link.querySelector("strong").textContent="Sample link only · your registry goes here"}));
