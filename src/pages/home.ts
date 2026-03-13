import { initAppShell } from "../lib/base";
import { playInstructionSignal, stopInstructionSignal } from "../lib/audio";
import { buildInstructionEntry, scrambleTo } from "../lib/instruction";
import { renderIcon } from "../lib/icons";
import { getCountdown, getHomePanelState, getQuickLinks, getSchedule, getTodos, saveCountdown, saveHomePanelState, saveQuickLinks } from "../lib/storage";
import type { HomePanelState, IconId, QuickLink, SearchEngine } from "../lib/types";
import { homeShowcase, homeSidebarLinks, searchEngines, toolCards } from "../data/site";
import { formatDateTime, statusLabel, todayIso, uid } from "../lib/utils";
import "../styles/global.css";

initAppShell("home");

interface ShowcaseEntry {
  href: string;
  label: string;
  iconId: IconId;
  external?: boolean;
}

const quickLinksList = document.querySelector<HTMLUListElement>("#quickLinksList");
const todoPreview = document.querySelector<HTMLUListElement>("#todoPreview");
const schedulePreview = document.querySelector<HTMLUListElement>("#schedulePreview");
const countdownValue = document.querySelector<HTMLElement>("#countdownValue");
const countdownTitle = document.querySelector<HTMLElement>("#countdownTitle");
const showcaseTitle = document.querySelector<HTMLElement>("#showcaseTitle");
const showcaseIconGrid = document.querySelector<HTMLElement>("#showcaseIconGrid");
const instructionImage = document.querySelector<HTMLImageElement>("#instructionImage");
const instructionPrimary = document.querySelector<HTMLElement>("#instructionPrimary");
const refreshInstructionButton = document.querySelector<HTMLButtonElement>("#refreshInstructionButton");
const searchForm = document.querySelector<HTMLFormElement>("#homeSearchForm");
const searchEngineSelect = document.querySelector<HTMLSelectElement>("#homeSearchEngine");
const searchInput = document.querySelector<HTMLInputElement>("#homeSearchQuery");
const toggleAllPanelsButton = document.querySelector<HTMLButtonElement>("#toggleAllPanelsButton");
const panelNodes = {
  left: document.querySelector<HTMLElement>('[data-home-panel="left"]'),
  center: document.querySelector<HTMLElement>('[data-home-panel="center"]'),
  right: document.querySelector<HTMLElement>('[data-home-panel="right"]')
};
const panelToggleButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-panel-toggle]")];

let isInstructionReading = false;
let pendingInstructionGestureCleanup: (() => void) | null = null;
let panelState: HomePanelState = getHomePanelState();

const panelStateMap = {
  left: "leftCollapsed",
  center: "centerCollapsed",
  right: "rightCollapsed"
} as const;

const searchTargets: Record<SearchEngine, (query: string) => string> = {
  bing: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  bilibili: (query) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`,
  pixiv: (query) => `https://www.pixiv.net/tags/${encodeURIComponent(query)}/artworks`
};

function buildShowcaseEntries(): ShowcaseEntry[] {
  const entryMap = new Map<string, ShowcaseEntry>();
  homeSidebarLinks.forEach((item) => {
    entryMap.set(item.href, { href: item.href, label: item.label, iconId: item.iconId, external: item.external });
  });
  toolCards.forEach((item) => {
    entryMap.set(item.href, { href: item.href, label: item.title, iconId: item.iconId });
  });
  return [...entryMap.values()];
}

function syncPanelState(): void {
  (Object.keys(panelNodes) as Array<keyof typeof panelStateMap>).forEach((panelKey) => {
    const collapsed = panelState[panelStateMap[panelKey]];
    const node = panelNodes[panelKey];
    if (!node) return;
    node.dataset.collapsed = collapsed ? "true" : "false";
  });

  panelToggleButtons.forEach((button) => {
    const panelKey = button.dataset.panelToggle as keyof typeof panelStateMap | undefined;
    if (!panelKey) return;
    const collapsed = panelState[panelStateMap[panelKey]];
    button.textContent = collapsed ? "展开" : "收起";
    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
  });

  if (toggleAllPanelsButton) {
    const allCollapsed = panelState.leftCollapsed && panelState.centerCollapsed && panelState.rightCollapsed;
    toggleAllPanelsButton.textContent = allCollapsed ? "全部展开" : "全部收起";
    toggleAllPanelsButton.setAttribute("aria-pressed", allCollapsed ? "true" : "false");
  }
}

function saveAndSyncPanels(): void {
  saveHomePanelState(panelState);
  syncPanelState();
}

function mountPanelControls(): void {
  syncPanelState();

  panelToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.panelToggle as keyof typeof panelStateMap | undefined;
      if (!panelKey) return;
      const stateKey = panelStateMap[panelKey];
      panelState = { ...panelState, [stateKey]: !panelState[stateKey] };
      saveAndSyncPanels();
    });
  });

  toggleAllPanelsButton?.addEventListener("click", () => {
    const allCollapsed = panelState.leftCollapsed && panelState.centerCollapsed && panelState.rightCollapsed;
    panelState = {
      leftCollapsed: !allCollapsed,
      centerCollapsed: !allCollapsed,
      rightCollapsed: !allCollapsed
    };
    saveAndSyncPanels();
  });
}

function renderShowcase(): void {
  if (showcaseTitle) showcaseTitle.textContent = homeShowcase.title;
  if (!showcaseIconGrid) return;
  showcaseIconGrid.innerHTML = buildShowcaseEntries().map((item) => `
    <a class="showcase-entry" href="${item.href}" ${item.external ? 'target="_blank" rel="noreferrer"' : ""}>
      <span class="showcase-entry__icon">${renderIcon(item.iconId, "showcase-entry__glyph")}</span>
      <span class="showcase-entry__label">${item.label}</span>
    </a>
  `).join("");
}

function mountSearch(): void {
  if (!searchEngineSelect) return;
  searchEngineSelect.innerHTML = searchEngines.map((engine) => `<option value="${engine.value}">${engine.label}</option>`).join("");
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput?.value.trim() ?? "";
    if (!query) return;
    const engine = (searchEngineSelect.value as SearchEngine) || "bing";
    window.open(searchTargets[engine](query), "_blank", "noopener,noreferrer");
  });
}

function renderQuickLinks(): void {
  const links = getQuickLinks();
  if (!quickLinksList) return;
  if (links.length === 0) {
    quickLinksList.innerHTML = `<li class="empty-state">还没有常驻链接。</li>`;
    return;
  }
  quickLinksList.innerHTML = "";
  links.forEach((link) => {
    const item = document.createElement("li");
    item.className = "mini-item mini-item--iconic quicklink-card";
    item.innerHTML = `
      <div class="mini-item__lead quicklink-card__lead">
        <span class="quicklink-badge" data-accent="${link.accent}">${renderIcon(link.iconId, "quicklink-icon")}</span>
        <div class="quicklink-card__copy"><strong>${link.label}</strong><span class="muted">${link.url}</span></div>
      </div>
      <div class="split-actions quicklink-card__actions">
        <a class="ghost-button" href="${link.url}" target="_blank" rel="noreferrer">打开</a>
        <button class="ghost-button" type="button" data-remove-link="${link.id}">移除</button>
      </div>`;
    quickLinksList.appendChild(item);
  });
  quickLinksList.querySelectorAll<HTMLButtonElement>("[data-remove-link]").forEach((button) => {
    button.addEventListener("click", () => {
      saveQuickLinks(getQuickLinks().filter((link) => link.id !== button.dataset.removeLink));
      renderQuickLinks();
    });
  });
}

function renderTodoPreview(): void {
  if (!todoPreview) return;
  const todos = getTodos().filter((item) => !item.done).slice(0, 4);
  todoPreview.innerHTML = todos.length === 0 ? `<li class="empty-state">今天没有未完成事项。</li>` : "";
  todos.forEach((item) => {
    const node = document.createElement("li");
    node.className = "mini-item mini-item--iconic";
    node.innerHTML = `<div class="mini-item__lead"><span class="mini-item__icon">${renderIcon("bookmark", "mini-icon")}</span><div><strong>${item.text}</strong><span class="muted">${item.dueAt ? `截止 ${formatDateTime(item.dueAt)}` : "未设置截止时间"}</span></div></div>`;
    todoPreview.appendChild(node);
  });
}

function renderSchedulePreview(): void {
  if (!schedulePreview) return;
  const items = getSchedule().filter((item) => item.date === todayIso()).sort((a, b) => a.start.localeCompare(b.start)).slice(0, 4);
  schedulePreview.innerHTML = items.length === 0 ? `<li class="empty-state">今天还没有安排。</li>` : "";
  items.forEach((item) => {
    const node = document.createElement("li");
    node.className = "mini-item mini-item--iconic";
    node.innerHTML = `<div class="mini-item__lead"><span class="mini-item__icon">${renderIcon("calendar", "mini-icon")}</span><div><strong>${item.title}</strong><span class="muted">${item.start.slice(11, 16)} - ${item.end.slice(11, 16)}</span></div></div><span class="pill">${statusLabel(item.status)}</span>`;
    schedulePreview.appendChild(node);
  });
}

function mountCountdown(): void {
  const render = () => {
    const countdown = getCountdown();
    const diff = Math.max(new Date(countdown.targetAt).getTime() - Date.now(), 0);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    if (countdownValue) countdownValue.textContent = `${String(days).padStart(2, "0")} : ${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
    if (countdownTitle) countdownTitle.textContent = `${countdown.title} · ${formatDateTime(countdown.targetAt)}`;
  };
  render();
  window.setInterval(render, 1000);
  document.querySelector<HTMLButtonElement>("#editCountdownButton")?.addEventListener("click", () => {
    const current = getCountdown();
    const title = window.prompt("倒计时标题", current.title);
    if (!title) return;
    const targetAt = window.prompt("目标时间，格式 YYYY-MM-DDTHH:MM", current.targetAt.slice(0, 16));
    if (!targetAt) return;
    saveCountdown({ ...current, title, targetAt });
    render();
  });
}

function mountQuickLinkCreate(): void {
  document.querySelector<HTMLButtonElement>("#addQuickLinkButton")?.addEventListener("click", () => {
    const label = window.prompt("链接名称"); if (!label) return;
    const url = window.prompt("链接地址，需要包含 https://", "https://"); if (!url) return;
    const next: QuickLink = { id: uid("link"), label, url, iconId: /github/i.test(url) ? "github" : /bilibili/i.test(url) ? "bilibili" : /youtube/i.test(url) ? "youtube" : "link", accent: /github/i.test(url) ? "night" : /bilibili/i.test(url) ? "sky" : /youtube/i.test(url) ? "rose" : "berry" };
    saveQuickLinks([...getQuickLinks(), next]); renderQuickLinks();
  });
}

function setInstructionReadingState(reading: boolean): void {
  isInstructionReading = reading;
  if (!refreshInstructionButton) return;
  refreshInstructionButton.disabled = reading;
  refreshInstructionButton.setAttribute("aria-busy", reading ? "true" : "false");
}

function clearPendingInstructionGesture(): void { if (pendingInstructionGestureCleanup) { pendingInstructionGestureCleanup(); pendingInstructionGestureCleanup = null; } }

function armInstructionSignalOnGesture(): void {
  if (pendingInstructionGestureCleanup) return;
  const handler = () => {
    if (!isInstructionReading) return clearPendingInstructionGesture();
    void playInstructionSignal().then((started) => { if (started) clearPendingInstructionGesture(); });
  };
  window.addEventListener("pointerdown", handler, { once: true });
  window.addEventListener("keydown", handler, { once: true });
  pendingInstructionGestureCleanup = () => { window.removeEventListener("pointerdown", handler); window.removeEventListener("keydown", handler); };
}

async function renderInstruction(withSignal = false): Promise<void> {
  if (isInstructionReading) return;
  const entry = buildInstructionEntry();
  if (instructionImage) { instructionImage.src = entry.iconAsset; instructionImage.alt = "指令图标"; }
  setInstructionReadingState(true);
  if (withSignal) { const started = await playInstructionSignal(); if (!started) armInstructionSignalOnGesture(); }
  await scrambleTo(instructionPrimary, entry.primary, 18);
  clearPendingInstructionGesture(); stopInstructionSignal(); setInstructionReadingState(false);
}

function mountInstructionWidget(): void {
  refreshInstructionButton?.addEventListener("click", () => { if (!isInstructionReading) void renderInstruction(true); });
  document.querySelector<HTMLButtonElement>("#copyInstructionButton")?.addEventListener("click", async () => {
    const text = instructionPrimary?.textContent ?? ""; if (!text) return;
    try { await navigator.clipboard.writeText(text); } catch { window.alert(text); }
  });
  void renderInstruction(true);
}

renderShowcase();
mountSearch();
renderQuickLinks();
renderTodoPreview();
renderSchedulePreview();
mountCountdown();
mountQuickLinkCreate();
mountInstructionWidget();
mountPanelControls();
