import { initAppShell } from "../lib/base";
import { getCountdown, getTodos, saveCountdown, saveTodos } from "../lib/storage";
import type { TodoItem } from "../lib/types";
import { formatDateTime, uid } from "../lib/utils";
import "../styles/global.css";

initAppShell("tools");

let filter: "all" | "open" | "done" = "all";

const form = document.querySelector<HTMLFormElement>("#todoForm");
const list = document.querySelector<HTMLUListElement>("#todoList");
const total = document.querySelector<HTMLElement>("#todoTotal");

function readItems(): TodoItem[] {
  return getTodos().sort((a, b) => Number(a.done) - Number(b.done));
}

function render(): void {
  const items = readItems();
  if (total) total.textContent = `${items.length}`;
  if (!list) return;
  list.innerHTML = "";

  const visible = items.filter((item) => {
    if (filter === "open") return !item.done;
    if (filter === "done") return item.done;
    return true;
  });

  if (visible.length === 0) {
    list.innerHTML = `<li class="empty-state">当前筛选条件下没有任务。</li>`;
    return;
  }

  visible.forEach((item) => {
    const node = document.createElement("li");
    node.className = "mini-item";
    node.innerHTML = `
      <div>
        <strong style="${item.done ? "text-decoration: line-through; opacity: 0.66;" : ""}">${item.text}</strong>
        <span class="muted">${item.dueAt ? `截止 ${formatDateTime(item.dueAt)}` : "没有设置截止时间"}</span>
      </div>
      <div class="split-actions">
        <button class="ghost-button" type="button" data-toggle="${item.id}">${item.done ? "恢复" : "完成"}</button>
        <button class="ghost-button" type="button" data-countdown="${item.id}">设为倒计时</button>
        <button class="ghost-button" type="button" data-remove="${item.id}">删除</button>
      </div>
    `;
    list.appendChild(node);
  });

  list.querySelectorAll<HTMLButtonElement>("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.toggle;
      if (!id) return;
      saveTodos(
        getTodos().map((item) => (item.id === id ? { ...item, done: !item.done } : item))
      );
      render();
    });
  });

  list.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.remove;
      if (!id) return;
      saveTodos(getTodos().filter((item) => item.id !== id));
      render();
    });
  });

  list.querySelectorAll<HTMLButtonElement>("[data-countdown]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.countdown;
      const item = getTodos().find((entry) => entry.id === id);
      if (!item) return;
      const current = getCountdown();
      const targetAt =
        window.prompt("截止时间，格式 YYYY-MM-DDTHH:MM", item.dueAt?.slice(0, 16) ?? current.targetAt.slice(0, 16)) ??
        "";
      if (!targetAt) return;
      saveCountdown({
        ...current,
        title: item.text,
        linkedTaskId: item.id,
        targetAt
      });
      window.alert("首页倒计时已更新。");
    });
  });
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const text = String(formData.get("todoText") ?? "").trim();
  const dueAt = String(formData.get("todoDueAt") ?? "").trim();
  if (!text) return;
  const next: TodoItem = {
    id: uid("todo"),
    text,
    done: false,
    createdAt: new Date().toISOString(),
    dueAt: dueAt || undefined
  };
  saveTodos([next, ...getTodos()]);
  form.reset();
  render();
});

document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    filter = (button.dataset.filter as typeof filter) ?? "all";
    render();
  });
});

render();
