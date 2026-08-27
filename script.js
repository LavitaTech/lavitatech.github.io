const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (navToggle && primaryNav) {
  const closeMenu = () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
}

// Make every Home link return to a freshly loaded homepage at the very top.
const forceTopKey = "lavitatech-force-home-top";

document.querySelectorAll("[data-home-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.setItem(forceTopKey, "true");
    window.location.href = "/";
  });
});

if (sessionStorage.getItem(forceTopKey) === "true") {
  sessionStorage.removeItem(forceTopKey);

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  });
}
