import { initAppShell } from "../lib/base";
import {
  getCountdown,
  getFocusState,
  getKanban,
  getQuickLinks,
  getSchedule,
  getTodos,
  saveCountdown,
  saveQuickLinks
} from "../lib/storage";
import type { QuickLink } from "../lib/types";
import { formatDateTime, formatDuration, statusLabel, todayIso, uid } from "../lib/utils";
import { docCards, toolCards } from "../data/site";
import "../styles/global.css";

initAppShell("home");

const quickLinksList = document.querySelector<HTMLUListElement>("#quickLinksList");
const todoPreview = document.querySelector<HTMLUListElement>("#todoPreview");
const schedulePreview = document.querySelector<HTMLUListElement>("#schedulePreview");
const toolGrid = document.querySelector<HTMLElement>("#toolGrid");
const docGrid = document.querySelector<HTMLElement>("#docGrid");
const countdownValue = document.querySelector<HTMLElement>("#countdownValue");
const countdownTitle = document.querySelector<HTMLElement>("#countdownTitle");

function renderQuickLinks(): void {
  const links = getQuickLinks();
  if (!quickLinksList) return;

  document.querySelector("#quickLinkCount")!.textContent = `${links.length}`;
  quickLinksList.innerHTML = "";

  if (links.length === 0) {
    quickLinksList.innerHTML = `<li class="empty-state">还没有快捷链接，先加三个最常用入口。</li>`;
    return;
  }

  links.forEach((link) => {
    const item = document.createElement("li");
    item.className = "mini-item";
    item.innerHTML = `
      <div>
        <strong>${link.icon} ${link.label}</strong>
        <span class="muted">${link.url}</span>
      </div>
      <div class="split-actions">
        <a class="ghost-button" href="${link.url}" target="_blank" rel="noreferrer">打开</a>
        <button class="ghost-button" type="button" data-remove-link="${link.id}">删除</button>
      </div>
    `;
    quickLinksList.appendChild(item);
  });

  quickLinksList.querySelectorAll<HTMLButtonElement>("[data-remove-link]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.removeLink;
      if (!id) return;
      saveQuickLinks(getQuickLinks().filter((link) => link.id !== id));
      renderQuickLinks();
    });
  });
}

function renderTodoPreview(): void {
  const todos = getTodos().filter((item) => !item.done);
  document.querySelector("#todoCount")!.textContent = `${todos.length}`;
  if (!todoPreview) return;
  todoPreview.innerHTML = "";

  if (todos.length === 0) {
    todoPreview.innerHTML = `<li class="empty-state">今天没有未完成事项，首页已经清空。</li>`;
    return;
  }

  todos.slice(0, 4).forEach((item) => {
    const node = document.createElement("li");
    node.className = "mini-item";
    node.innerHTML = `
      <div>
        <strong>${item.text}</strong>
        <span class="muted">${item.dueAt ? `截止 ${formatDateTime(item.dueAt)}` : "没有设置截止时间"}</span>
      </div>
      <span class="pill">${item.dueAt ? "带时间" : "待办"}</span>
    `;
    todoPreview.appendChild(node);
  });
}

function renderSchedulePreview(): void {
  const schedule = getSchedule()
    .filter((item) => item.date === todayIso())
    .sort((a, b) => a.start.localeCompare(b.start));
  document.querySelector("#scheduleCount")!.textContent = `${schedule.length}`;
  if (!schedulePreview) return;
  schedulePreview.innerHTML = "";

  if (schedule.length === 0) {
    schedulePreview.innerHTML = `<li class="empty-state">今天没有安排，可以去时间页先建一条。</li>`;
    return;
  }

  schedule.slice(0, 4).forEach((item) => {
    const node = document.createElement("li");
    node.className = "mini-item";
    node.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <span class="muted">${item.start.slice(11, 16)} - ${item.end.slice(11, 16)}</span>
      </div>
      <span class="pill">${statusLabel(item.status)}</span>
    `;
    schedulePreview.appendChild(node);
  });
}

function renderKanbanPreview(): void {
  const board = getKanban();
  document.querySelector("#kanbanBacklogCount")!.textContent = `${board.backlog.length}`;
  document.querySelector("#kanbanBacklogMini")!.textContent = `${board.backlog.length}`;
  document.querySelector("#kanbanDoingMini")!.textContent = `${board.doing.length}`;
  document.querySelector("#kanbanDoneMini")!.textContent = `${board.done.length}`;
}

function renderFocusPreview(): void {
  const state = getFocusState();
  document.querySelector("#focusCount")!.textContent = `${state.completedCount}`;
  document.querySelector("#focusMinutes")!.textContent = formatDuration(state.totalMinutes);
}

function renderCards(): void {
  if (toolGrid) {
    toolGrid.innerHTML = toolCards
      .map(
        (card) => `
          <a class="tool-card" href="${card.href}">
            <span class="card-kicker">${card.kicker}</span>
            <h3 class="card-title">${card.title}</h3>
            <p class="card-copy">${card.copy}</p>
            <span class="card-footer">${card.footer}</span>
          </a>
        `
      )
      .join("");
  }

  if (docGrid) {
    docGrid.innerHTML = docCards
      .map(
        (card) => `
          <a class="doc-card" href="${card.href}">
            <span class="card-kicker">${card.kicker}</span>
            <h3 class="card-title">${card.title}</h3>
            <p class="card-copy">${card.copy}</p>
            <span class="card-footer">${card.footer}</span>
          </a>
        `
      )
      .join("");
  }
}

function mountCountdown(): void {
  const render = () => {
    const countdown = getCountdown();
    const target = new Date(countdown.targetAt).getTime();
    const now = Date.now();
    const diff = Math.max(target - now, 0);
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);
    if (countdownValue) {
      countdownValue.textContent = `${String(days).padStart(2, "0")} : ${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
    }
    if (countdownTitle) {
      countdownTitle.textContent = `${countdown.title} · 截止 ${formatDateTime(countdown.targetAt)}`;
    }
  };

  render();
  window.setInterval(render, 1000);

  document.querySelector<HTMLButtonElement>("#editCountdownButton")?.addEventListener("click", () => {
    const current = getCountdown();
    const title = window.prompt("倒计时标题", current.title);
    if (!title) return;
    const targetAt = window.prompt("截止时间，格式 YYYY-MM-DDTHH:MM", current.targetAt.slice(0, 16));
    if (!targetAt) return;
    saveCountdown({
      ...current,
      title,
      targetAt
    });
    render();
  });
}

function mountSearch(): void {
  document.querySelector<HTMLFormElement>("#searchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const engine = document.querySelector<HTMLSelectElement>("#engineSelect")?.value ?? "bing";
    const keyword = document.querySelector<HTMLInputElement>("#searchInput")?.value.trim();
    if (!keyword) return;
    const query = encodeURIComponent(keyword);
    const targets: Record<string, string> = {
      bing: `https://www.bing.com/search?q=${query}`,
      google: `https://www.google.com/search?q=${query}`,
      github: `https://github.com/search?q=${query}`,
      bilibili: `https://search.bilibili.com/all?keyword=${query}`
    };
    window.open(targets[engine] ?? targets.bing, "_blank", "noopener,noreferrer");
  });
}

function mountQuickLinkCreate(): void {
  document.querySelector<HTMLButtonElement>("#addQuickLinkButton")?.addEventListener("click", () => {
    const label = window.prompt("链接名称");
    if (!label) return;
    const url = window.prompt("链接地址，需要包含 https://", "https://");
    if (!url) return;
    const icon = window.prompt("图标符号", "↗") ?? "↗";
    const next: QuickLink = {
      id: uid("link"),
      label,
      url,
      icon,
      accent: "custom"
    };
    saveQuickLinks([...getQuickLinks(), next]);
    renderQuickLinks();
  });
}

renderCards();
renderQuickLinks();
renderTodoPreview();
renderSchedulePreview();
renderKanbanPreview();
renderFocusPreview();
mountCountdown();
mountSearch();
mountQuickLinkCreate();
