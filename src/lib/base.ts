import { siteProfile } from "../data/site";
import { mountAudioDock, playEffect } from "./audio";
import { renderIcon } from "./icons";
import { getTheme, setTheme } from "./storage";

const navIcons = {
  home: "home",
  tools: "sparkle",
  docs: "book"
} as const;

export function initAppShell(activeSection: "home" | "tools" | "docs"): void {
  const root = document.documentElement;
  const theme = getTheme();
  root.dataset.theme = theme;
  document.body.dataset.section = activeSection;
  root.style.setProperty("--wallpaper-day", `url("${siteProfile.wallpaperDay}")`);
  root.style.setProperty("--wallpaper-night", `url("${siteProfile.wallpaperNight}")`);

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

  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((item) => {
    const key = item.dataset.nav as keyof typeof navIcons;
    const label = item.textContent?.trim() ?? "";
    item.dataset.active = key === activeSection ? "true" : "false";
    item.innerHTML = `${renderIcon(navIcons[key] ?? "link", "chip-icon")}<span>${label}</span>`;
  });

  const year = document.querySelector<HTMLElement>("[data-year]");
  if (year) year.textContent = `${new Date().getFullYear()}`;

  mountAudioDock();
  bindButtonSounds();
}

function bindButtonSounds(): void {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest(".audio-dock")) return;
    if (
      target.closest("button") ||
      target.closest(".button") ||
      target.closest(".ghost-button") ||
      target.closest(".nav-chip") ||
      target.closest(".theme-button") ||
      target.closest(".tab-button")
    ) {
      playEffect("click");
    }
  });
}

function syncThemeToggle(button: HTMLButtonElement, theme: string): void {
  button.innerHTML = `${renderIcon(theme === "night" ? "sun" : "moon", "button-icon")}<span>${theme === "night" ? "切到白昼" : "切到夜色"}</span>`;
  button.setAttribute("aria-label", theme === "night" ? "切换到白昼主题" : "切换到夜色主题");
}
