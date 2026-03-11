import { initAppShell } from "../lib/base";
import { renderIcon } from "../lib/icons";
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
import {
  collectionItems,
  docCards,
  showcaseItems,
  siteProfile,
  statusPills,
  toolCards
} from "../data/site";
import { formatDateTime, formatDuration, statusLabel, todayIso, uid } from "../lib/utils";
import "../styles/global.css";

initAppShell("home");

const quickLinksList = document.querySelector<HTMLUListElement>("#quickLinksList");
const todoPreview = document.querySelector<HTMLUListElement>("#todoPreview");
const schedulePreview = document.querySelector<HTMLUListElement>("#schedulePreview");
const toolGrid = document.querySelector<HTMLElement>("#toolGrid");
const docGrid = document.querySelector<HTMLElement>("#docGrid");
const countdownValue = document.querySelector<HTMLElement>("#countdownValue");
const countdownTitle = document.querySelector<HTMLElement>("#countdownTitle");
const collectionGrid = document.querySelector<HTMLElement>("#collectionGrid");
const showcaseGrid = document.querySelector<HTMLElement>("#showcaseGrid");
const statusPillRow = document.querySelector<HTMLElement>("#statusPills");

function renderStaticProfile(): void {
  document.querySelector<HTMLElement>("#profileSubtitle")!.textContent = siteProfile.subtitle;
  document.querySelector<HTMLElement>("#profileIntro")!.textContent = siteProfile.intro;
  document.querySelector<HTMLElement>("#profileStatus")!.textContent = siteProfile.status;
  document.querySelector<HTMLElement>("#profileMood")!.textContent = siteProfile.currentMood;
  const avatar = document.querySelector<HTMLImageElement>("#profileAvatar");
  if (avatar) {
    avatar.src = siteProfile.avatarAsset;
    avatar.alt = `${siteProfile.name} 角色立绘占位图`;
  }

  if (statusPillRow) {
    statusPillRow.innerHTML = statusPills.map((item) => `<span class="status-chip">${item}</span>`).join("");
  }
}

function cardMarkup(card: {
  href: string;
  kicker: string;
  title: string;
  copy: string;
  footer: string;
  iconId: QuickLink["iconId"];
  coverAsset: string;
  tags: string[];
}): string {
  return `
    <a class="tool-card" href="${card.href}">
      <div class="card-cover" style="background-image: url('${card.coverAsset}')"></div>
      <div class="card-body">
        <span class="card-kicker">${card.kicker}</span>
        <div class="card-headline">
          ${renderIcon(card.iconId)}
          <h3 class="card-title">${card.title}</h3>
        </div>
        <p class="card-copy">${card.copy}</p>
        <div class="card-tags">${card.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}</div>
        <span class="card-footer">${card.footer}</span>
      </div>
    </a>
  `;
}

function renderCards(): void {
  if (collectionGrid) {
    collectionGrid.innerHTML = collectionItems
      .map(
        (item) => `
          <a class="collection-card" href="${item.href}">
            <div class="card-cover" style="background-image: url('${item.coverAsset}')"></div>
            <div class="card-body">
              <div class="card-headline">
                ${renderIcon(item.iconId)}
                <h3 class="card-title">${item.title}</h3>
              </div>
              <p class="card-copy">${item.description}</p>
              <div class="card-tags">${item.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}</div>
            </div>
          </a>
        `
      )
      .join("");
  }

  if (showcaseGrid) {
    showcaseGrid.innerHTML = showcaseItems
      .map(
        (item) => `
          <a class="showcase-card" href="${item.href}">
            <div class="card-cover" style="background-image: url('${item.coverAsset}')"></div>
            <div class="card-body">
              <div class="card-headline">
                ${renderIcon(item.iconId)}
                <h3 class="card-title">${item.title}</h3>
              </div>
              <p class="card-copy">${item.description}</p>
              <span class="card-footer">${item.footer}</span>
            </div>
          </a>
        `
      )
      .join("");
  }

  if (toolGrid) {
    toolGrid.innerHTML = toolCards.map(cardMarkup).join("");
  }

  if (docGrid) {
    docGrid.innerHTML = docCards.map(cardMarkup).join("");
  }
}

function renderQuickLinks(): void {
  const links = getQuickLinks();
  if (!quickLinksList) return;

  document.querySelector("#quickLinkCount")!.textContent = `${links.length}`;
  quickLinksList.innerHTML = "";

  if (links.length === 0) {
    quickLinksList.innerHTML = `<li class="empty-state">还没有收藏入口，先放几个你最常用的网站吧。</li>`;
    return;
  }

  links.forEach((link) => {
    const item = document.createElement("li");
    item.className = "mini-item";
    item.innerHTML = `
      <div class="quicklink-row">
        <span class="quicklink-badge" data-accent="${link.accent}">
          ${renderIcon(link.iconId, "quicklink-icon")}
        </span>
        <div>
          <strong>${link.label}</strong>
          <span class="muted">${link.url}</span>
        </div>
      </div>
      <div class="split-actions">
        <a class="ghost-button" href="${link.url}" target="_blank" rel="noreferrer">打开</a>
        <button class="ghost-button" type="button" data-remove-link="${link.id}">移除</button>
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
    todoPreview.innerHTML = `<li class="empty-state">今天的待办已经清空，可以放心去逛别的页面了。</li>`;
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
      <span class="pill">${item.dueAt ? "有时限" : "慢慢来"}</span>
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
    schedulePreview.innerHTML = `<li class="empty-state">今天还没有排进日程的事情，页面会一直替你留着这个空位。</li>`;
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
  document.querySelector("#kanbanBacklogMini")!.textContent = `${board.backlog.length}`;
  document.querySelector("#kanbanDoingMini")!.textContent = `${board.doing.length}`;
  document.querySelector("#kanbanDoneMini")!.textContent = `${board.done.length}`;
}

function renderFocusPreview(): void {
  const state = getFocusState();
  document.querySelector("#focusCount")!.textContent = `${state.completedCount}`;
  document.querySelector("#focusMinutes")!.textContent = formatDuration(state.totalMinutes);
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
    const targetAt = window.prompt(
      "截止时间，格式 YYYY-MM-DDTHH:MM",
      current.targetAt.slice(0, 16)
    );
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
    const next: QuickLink = {
      id: uid("link"),
      label,
      url,
      iconId: /github/i.test(url) ? "github" : /bilibili|youtube/i.test(url) ? "video" : "link",
      accent: /github/i.test(url) ? "night" : /bilibili/i.test(url) ? "sky" : /youtube/i.test(url) ? "rose" : "berry"
    };
    saveQuickLinks([...getQuickLinks(), next]);
    renderQuickLinks();
  });
}

renderStaticProfile();
renderCards();
renderQuickLinks();
renderTodoPreview();
renderSchedulePreview();
renderKanbanPreview();
renderFocusPreview();
mountCountdown();
mountSearch();
mountQuickLinkCreate();
