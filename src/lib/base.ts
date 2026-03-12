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

const homeChrome: RouteChrome = {
  pattern: /(?:\/|\/index\.html)$/i,
  title: "YusNote | Moonlit Shelf",
  brandTitle: "YusNote"
};

interface RouteChrome {
  pattern: RegExp;
  title: string;
  brandTitle: string;
  pageHeading?: string;
}

const routeChrome: RouteChrome[] = [
  { pattern: /tools\/todo\.html$/i, title: "Todo 清单 | YusNote", brandTitle: "Todo 清单", pageHeading: "Todo 清单" },
  { pattern: /tools\/schedule\.html$/i, title: "时间安排 | YusNote", brandTitle: "时间安排", pageHeading: "时间安排" },
  { pattern: /tools\/kanban\.html$/i, title: "看板 | YusNote", brandTitle: "看板", pageHeading: "看板" },
  { pattern: /tools\/focus\.html$/i, title: "Pomodoro | YusNote", brandTitle: "Pomodoro", pageHeading: "Pomodoro" },
  { pattern: /tools\/creative\.html$/i, title: "Creative Studio | YusNote", brandTitle: "Creative Studio", pageHeading: "Creative Studio" },
  { pattern: /tools\/compare\.html$/i, title: "目录比对 | YusNote", brandTitle: "目录比对", pageHeading: "目录比对" },
  { pattern: /tools\/rename\.html$/i, title: "批量重命名 | YusNote", brandTitle: "批量重命名", pageHeading: "批量重命名" },
  { pattern: /tools\/keyword\.html$/i, title: "关键词卡片 | YusNote", brandTitle: "关键词卡片", pageHeading: "关键词卡片" },
  { pattern: /tools\/divination\.html$/i, title: "投币占卜 | YusNote", brandTitle: "投币占卜", pageHeading: "投币占卜" },
  { pattern: /tools\/game\.html$/i, title: "Cyber Dash | YusNote", brandTitle: "Cyber Dash", pageHeading: "Cyber Dash" },
  { pattern: /docs\/index\.html$/i, title: "内容 | YusNote", brandTitle: "内容", pageHeading: "📚 书架" },
  { pattern: /docs\/guide\.html$/i, title: "Yus 开发总览 | YusNote", brandTitle: "Yus 开发总览" },
  { pattern: /docs\/unity-ui\.html$/i, title: "Unity UI 体系 | YusNote", brandTitle: "Unity UI 体系" },
  { pattern: /docs\/audio-system\.html$/i, title: "全局音频系统 | YusNote", brandTitle: "全局音频系统" },
  { pattern: /docs\/will-of-the-city\.html$/i, title: "指令 | YusNote", brandTitle: "指令", pageHeading: "📡 指令" }
];

export function initAppShell(activeSection: "home" | "tools" | "docs"): void {
  const root = document.documentElement;
  const theme = getTheme();
  root.dataset.theme = theme;
  document.body.dataset.section = activeSection;
  normalizePageChrome(activeSection);
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
  const matched = matchRouteChrome(pathname);
  const current = (matched?.title ?? document.title).replace(/^[🌙🧰📚📡]\s*/, "").trim();
  const prefix = /will-of-the-city\.html$/i.test(pathname)
    ? "📡"
    : activeSection === "home"
      ? "🌙"
      : activeSection === "tools"
        ? "🧰"
        : "📚";
  document.title = `${prefix} ${current}`;
}

function normalizePageChrome(activeSection: "home" | "tools" | "docs"): void {
  const pathname = window.location.pathname;
  const matched = matchRouteChrome(pathname);
  const brandTitle = document.querySelector<HTMLElement>(".brand-title");
  if (brandTitle && matched?.brandTitle) {
    brandTitle.textContent = matched.brandTitle;
  }

  document.querySelectorAll<HTMLElement>(".brand-subtitle, .lead, .hero-note").forEach((node) => {
    node.textContent = "";
    node.hidden = true;
  });

  const pageHeading = document.querySelector<HTMLElement>(".page-hero h1, .page-heading");
  if (pageHeading && matched?.pageHeading) {
    pageHeading.textContent = matched.pageHeading;
  }

  const footer = document.querySelector<HTMLElement>(".site-footer");
  const footerSpans = footer?.querySelectorAll<HTMLElement>("span");
  if (footerSpans && footerSpans.length >= 2) {
    footerSpans[0].textContent = activeSection === "home" ? "YusNote" : matched?.brandTitle ?? "YusNote";
    footerSpans[1].innerHTML = `&copy; <span data-year></span> YusNote`;
  }
}

function matchRouteChrome(pathname: string): RouteChrome | undefined {
  return routeChrome.find((item) => item.pattern.test(pathname)) ?? (homeChrome.pattern.test(pathname) ? homeChrome : undefined);
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
