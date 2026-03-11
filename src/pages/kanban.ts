import Sortable from "sortablejs";
import { initAppShell } from "../lib/base";
import { getCountdown, getKanban, saveCountdown, saveKanban } from "../lib/storage";
import type { KanbanBoard, KanbanTask } from "../lib/types";
import { formatDateTime, uid } from "../lib/utils";
import "../styles/global.css";

initAppShell("tools");

type ColumnKey = keyof KanbanBoard;

const columns: ColumnKey[] = ["backlog", "doing", "done"];

function render(): void {
  const board = getKanban();
  columns.forEach((column) => {
    const mount = document.querySelector<HTMLElement>(`#${column}List`);
    const counter = document.querySelector<HTMLElement>(`#count${capitalize(column)}`);
    if (counter) counter.textContent = `${board[column].length}`;
    if (!mount) return;
    mount.innerHTML = "";
    board[column].forEach((task) => {
      const card = document.createElement("article");
      card.className = "mini-item";
      card.dataset.taskId = task.id;
      card.innerHTML = `
        <div>
          <strong contenteditable="true" data-role="title">${task.text}</strong>
          <span class="muted">${task.note || "没有备注"}${task.dueAt ? ` · 截止 ${formatDateTime(task.dueAt)}` : ""}</span>
        </div>
        <div class="split-actions">
          <button class="ghost-button" type="button" data-edit="${task.id}">备注</button>
          <button class="ghost-button" type="button" data-countdown="${task.id}">倒计时</button>
          <button class="ghost-button" type="button" data-remove="${task.id}">删除</button>
        </div>
      `;
      mount.appendChild(card);
    });
  });

  document.querySelectorAll<HTMLElement>("[contenteditable='true']").forEach((editable) => {
    editable.addEventListener("blur", () => {
      const card = editable.closest<HTMLElement>("[data-task-id]");
      if (!card) return;
      updateTask(card.dataset.taskId ?? "", { text: editable.textContent?.trim() || "未命名任务" });
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.edit ?? "";
      const board = getKanban();
      const current = findTask(board, id);
      if (!current) return;
      const note = window.prompt("备注", current.task.note) ?? current.task.note;
      const dueAt = window.prompt("截止时间，格式 YYYY-MM-DDTHH:MM，可留空", current.task.dueAt?.slice(0, 16) ?? "") ?? "";
      updateTask(id, { note, dueAt: dueAt || undefined });
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-countdown]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.countdown ?? "";
      const task = findTask(getKanban(), id)?.task;
      if (!task) return;
      const current = getCountdown();
      const targetAt =
        window.prompt("截止时间，格式 YYYY-MM-DDTHH:MM", task.dueAt?.slice(0, 16) ?? current.targetAt.slice(0, 16)) ??
        "";
      if (!targetAt) return;
      saveCountdown({
        ...current,
        title: task.text,
        linkedTaskId: task.id,
        targetAt
      });
      window.alert("首页倒计时已更新。");
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.remove ?? "";
      removeTask(id);
    });
  });
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function findTask(board: KanbanBoard, id: string): { column: ColumnKey; task: KanbanTask } | null {
  for (const column of columns) {
    const task = board[column].find((entry) => entry.id === id);
    if (task) return { column, task };
  }
  return null;
}

function updateTask(id: string, patch: Partial<KanbanTask>): void {
  const board = getKanban();
  const found = findTask(board, id);
  if (!found) return;
  board[found.column] = board[found.column].map((task) =>
    task.id === id ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task
  );
  saveKanban(board);
  render();
}

function removeTask(id: string): void {
  const board = getKanban();
  columns.forEach((column) => {
    board[column] = board[column].filter((task) => task.id !== id);
  });
  saveKanban(board);
  render();
}

function addTask(column: ColumnKey): void {
  const text = window.prompt("任务标题");
  if (!text) return;
  const note = window.prompt("备注，可留空", "") ?? "";
  const board = getKanban();
  board[column].unshift({
    id: uid("kanban"),
    text,
    note,
    updatedAt: new Date().toISOString()
  });
  saveKanban(board);
  render();
}

function mountSortables(): void {
  columns.forEach((column) => {
    const element = document.querySelector<HTMLElement>(`#${column}List`);
    if (!element) return;
    Sortable.create(element, {
      group: "kanban",
      animation: 150,
      onEnd: () => {
        const source = getKanban();
        const next: KanbanBoard = { backlog: [], doing: [], done: [] };
        columns.forEach((key) => {
          const mount = document.querySelector<HTMLElement>(`#${key}List`);
          if (!mount) return;
          const ids = Array.from(mount.children).map((child) => (child as HTMLElement).dataset.taskId ?? "");
          next[key] = ids
            .map((id) => findTask(source, id)?.task)
            .filter((task): task is KanbanTask => Boolean(task));
        });
        saveKanban(next);
        render();
      }
    });
  });
}

document.querySelectorAll<HTMLButtonElement>("[data-add]").forEach((button) => {
  button.addEventListener("click", () => addTask((button.dataset.add as ColumnKey) ?? "backlog"));
});

mountSortables();
render();
