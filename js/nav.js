// Mobile nav toggle — shared across every page.
// Include this file at the bottom of <body> on every page.
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");

  if (!toggle || !links || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    nav.setAttribute("data-open", isOpen ? "true" : "false");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the mobile menu after a link is chosen, so navigation
  // never leaves the menu awkwardly open on the next page.
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
