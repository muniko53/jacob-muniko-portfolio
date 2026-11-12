/* Shared site behaviour: theme persistence and the mobile menu. */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const themeMeta = document.getElementById("theme-color-meta");

  const readTheme = () => {
    try {
      const stored = localStorage.getItem("jm-theme");
      return stored === "light" || stored === "dark" ? stored : "dark";
    } catch {
      return "dark";
    }
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);

    if (toggle) {
      const next = theme === "dark" ? "light" : "dark";
      const label = `Switch to ${next} theme`;
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }

    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#0C0F0E" : "#F2F3EC");
    }
  };

  applyTheme(readTheme());

  toggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("jm-theme", next);
    } catch {
      /* Storage can be unavailable; the theme still changes for this page. */
    }
  });

  const menu = document.querySelector(".mobile-menu");
  if (!menu) return;

  const summary = menu.querySelector("summary");

  const closeMenu = (returnFocus = false) => {
    if (!menu.open) return;
    menu.open = false;
    if (returnFocus) summary?.focus();
  };

  document.addEventListener("click", (event) => {
    if (menu.open && !menu.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.open) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  const wide = window.matchMedia("(min-width: 921px)");
  const onChange = (event) => {
    if (event.matches) closeMenu();
  };
  if (typeof wide.addEventListener === "function") wide.addEventListener("change", onChange);
  else if (typeof wide.addListener === "function") wide.addListener(onChange);
})();
