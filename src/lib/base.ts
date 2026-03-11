import { getTheme, setTheme } from "./storage";

export function initAppShell(activeSection: "home" | "tools" | "docs"): void {
  const root = document.documentElement;
  const theme = getTheme();
  root.dataset.theme = theme;

  const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (toggle) {
    syncThemeToggle(toggle, theme);
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "night" ? "day" : "night";
      root.dataset.theme = next;
      setTheme(next);
      syncThemeToggle(toggle, next);
    });
  }

  const navItems = document.querySelectorAll<HTMLElement>("[data-nav]");
  navItems.forEach((item) => {
    item.dataset.active = item.dataset.nav === activeSection ? "true" : "false";
  });

  const year = document.querySelector<HTMLElement>("[data-year]");
  if (year) year.textContent = `${new Date().getFullYear()}`;
}

function syncThemeToggle(button: HTMLButtonElement, theme: string): void {
  button.textContent = theme === "night" ? "切换到白昼" : "切换到夜色";
}
