import instructionAsset from "../assets/images/instruction.png";
import { siteProfile } from "../data/site";
import { mountAudioDock, playEffect } from "./audio";
import { renderIcon } from "./icons";
import { getTheme, setTheme } from "./storage";

const navIcons = {
  home: "home",
  tools: "sparkle",
  docs: "book"
} as const;

const navLabels = {
  home: "首页",
  tools: "工具",
  docs: "内容"
} as const;

const pageTitles: Array<[RegExp, string]> = [
  [/\/$/, "YusNote | Night Shelf"],
  [/index\.html$/i, "YusNote | Night Shelf"],
  [/tools\/todo\.html$/i, "Todo 清单 | YusNote"],
  [/tools\/schedule\.html$/i, "时间安排 | YusNote"],
  [/tools\/kanban\.html$/i, "看板 | YusNote"],
  [/tools\/focus\.html$/i, "Pomodoro | YusNote"],
  [/tools\/creative\.html$/i, "Creative Studio | YusNote"],
  [/tools\/compare\.html$/i, "目录比对 | YusNote"],
  [/tools\/rename\.html$/i, "批量重命名 | YusNote"],
  [/tools\/keyword\.html$/i, "关键词卡片 | YusNote"],
  [/tools\/divination\.html$/i, "投币占卜 | YusNote"],
  [/tools\/game\.html$/i, "Cyber Dash | YusNote"],
  [/docs\/index\.html$/i, "内容页 | YusNote"],
  [/docs\/guide\.html$/i, "Yus 开发总览 | YusNote"],
  [/docs\/unity-ui\.html$/i, "Unity UI 体系 | YusNote"],
  [/docs\/audio-system\.html$/i, "全局音频系统 | YusNote"],
  [/docs\/will-of-the-city\.html$/i, "指令 | YusNote"]
];

export function initAppShell(activeSection: "home" | "tools" | "docs"): void {
  const root = document.documentElement;
  const theme = getTheme();
  root.dataset.theme = theme;
  document.body.dataset.section = activeSection;
  ensureFavicon();
  ensureTitlePrefix(activeSection);
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
    const label = navLabels[key] ?? "";
    item.dataset.active = key === activeSection ? "true" : "false";
    item.innerHTML = `${renderIcon(navIcons[key] ?? "link", "chip-icon")}<span>${label}</span>`;
  });

  const year = document.querySelector<HTMLElement>("[data-year]");
  if (year) year.textContent = `${new Date().getFullYear()}`;

  mountAudioDock();
  bindButtonSounds();
}

function ensureFavicon(): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = instructionAsset;
}

function ensureTitlePrefix(activeSection: "home" | "tools" | "docs"): void {
  const pathname = window.location.pathname;
  const matched = pageTitles.find(([pattern]) => pattern.test(pathname));
  const current = (matched?.[1] ?? document.title).replace(/^[🌙🧰📚📡]\s*/, "").trim();
  const prefix = /will-of-the-city\.html$/i.test(pathname)
    ? "📡"
    : activeSection === "home"
      ? "🌙"
      : activeSection === "tools"
        ? "🧰"
        : "📚";
  document.title = `${prefix} ${current}`;
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
  const label = theme === "night" ? "切到白昼" : "切到夜色";
  button.innerHTML = `${renderIcon(theme === "night" ? "sun" : "moon", "button-icon")}<span>${label}</span>`;
  button.setAttribute("aria-label", label);
}
