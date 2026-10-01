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

// Analytics event helpers.
const sendAnalyticsEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, parameters);
};

// Track App Store button selections by product.
document.querySelectorAll("[data-app-store-link]").forEach((link) => {
  link.addEventListener("click", () => {
    sendAnalyticsEvent("app_store_click", {
      app_name: link.dataset.appName || "Unknown",
      link_url: link.href,
    });
  });
});

// Remember valid contact form submissions for the thank-you page.
const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", () => {
    try {
      sessionStorage.setItem(
        "lavitatech-contact-submitted",
        "true"
      );
    } catch {
      // Submission continues normally when storage is unavailable.
    }
  });
}

// Count a completed contact inquiry as a lead.
if (window.location.pathname.endsWith("/thanks.html")) {
  try {
    const submitted =
      sessionStorage.getItem(
        "lavitatech-contact-submitted"
      ) === "true";

    if (submitted) {
      sessionStorage.removeItem(
        "lavitatech-contact-submitted"
      );

      sendAnalyticsEvent("generate_lead", {
        lead_source: "LavitaTech website contact form",
      });
    }
  } catch {
    // No analytics event is sent when storage is unavailable.
  }
}
