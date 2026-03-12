import instructionAsset from "../assets/images/instruction.png";
import { siteProfile } from "../data/site";
import { mountAudioDock, playEffect } from "./audio";
import { renderIcon } from "./icons";
import { getTheme, setTheme } from "./storage";

type AppSection = "home" | "tools" | "docs";

const sectionPrefixes: Record<AppSection, string> = {
  home: "🌙",
  tools: "🧰",
  docs: "📚"
};

const pageTitles: { pattern: RegExp; title: string }[] = [
  { pattern: /tools\/todo\.html$/i, title: "Todo 清单 | YusNote" },
  { pattern: /tools\/schedule\.html$/i, title: "日程 | YusNote" },
  { pattern: /tools\/kanban\.html$/i, title: "看板 | YusNote" },
  { pattern: /tools\/focus\.html$/i, title: "Pomodoro | YusNote" },
  { pattern: /tools\/creative\.html$/i, title: "Creative Studio | YusNote" },
  { pattern: /tools\/compare\.html$/i, title: "目录对比 | YusNote" },
  { pattern: /tools\/rename\.html$/i, title: "批量重命名 | YusNote" },
  { pattern: /tools\/keyword\.html$/i, title: "关键词卡 | YusNote" },
  { pattern: /tools\/divination\.html$/i, title: "占卜 | YusNote" },
  { pattern: /tools\/game\.html$/i, title: "Cyber Dash | YusNote" },
  { pattern: /(?:\/|\/index\.html)$/i, title: "YusNote | Moonlit Window" }
];

export function initAppShell(activeSection: AppSection): void {
  const root = document.documentElement;
  const theme = getTheme();
  root.dataset.theme = theme;
  document.body.dataset.section = activeSection;

  ensureFavicon();
  ensureTitle(activeSection);
  root.style.setProperty("--wallpaper-day", `url("${siteProfile.wallpaperDay}")`);
  root.style.setProperty("--wallpaper-night", `url("${siteProfile.wallpaperNight}")`);

  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((toggle) => {
    syncThemeToggle(toggle, theme);
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "night" ? "day" : "night";
      root.dataset.theme = next;
      setTheme(next);
      syncThemeToggle(toggle, next);
    });
  });

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

function ensureTitle(activeSection: AppSection): void {
  const pathname = window.location.pathname;
  const matched = pageTitles.find((item) => item.pattern.test(pathname));
  const plainTitle = matched?.title ?? document.title.replace(/^[^\s]+\s+/, "").trim();
  document.title = `${sectionPrefixes[activeSection]} ${plainTitle}`;
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
      target.closest(".workspace-link") ||
      target.closest(".showcase-entry") ||
      target.closest(".sidebar-link")
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
