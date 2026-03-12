import { initAppShell } from "../lib/base";
import { getSchedule, saveSchedule } from "../lib/storage";
import type { ScheduleItem } from "../lib/types";
import { statusLabel, todayIso, uid } from "../lib/utils";
import "../styles/global.css";

initAppShell("tools");

const form = document.querySelector<HTMLFormElement>("#scheduleForm");
const list = document.querySelector<HTMLUListElement>("#scheduleList");
const filterDate = document.querySelector<HTMLInputElement>("#filterDate");
const saveButton = document.querySelector<HTMLButtonElement>("#saveScheduleButton");

let editingId: string | null = null;

function setDefaults(): void {
  const date = todayIso();
  const dateInput = document.querySelector<HTMLInputElement>("#date");
  const start = document.querySelector<HTMLInputElement>("#start");
  const end = document.querySelector<HTMLInputElement>("#end");
  if (dateInput && !dateInput.value) dateInput.value = date;
  if (filterDate && !filterDate.value) filterDate.value = date;
  if (start && !start.value) start.value = `${date}T09:00`;
  if (end && !end.value) end.value = `${date}T18:00`;
}

function render(): void {
  if (!list) return;
  const visibleDate = filterDate?.value || todayIso();
  const items = getSchedule()
    .filter((item) => item.date === visibleDate)
    .sort((a, b) => a.start.localeCompare(b.start));
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = `<li class="empty-state">这个日期还没有安排。</li>`;
    return;
  }

  items.forEach((item) => {
    const node = document.createElement("li");
    node.className = "mini-item";
    node.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <span class="muted">${item.start.slice(11, 16)} - ${item.end.slice(11, 16)} · ${statusLabel(item.status)}</span>
        <span class="muted">${item.note || "没有备注"}</span>
      </div>
      <div class="split-actions">
        <button class="ghost-button" type="button" data-edit="${item.id}">编辑</button>
        <button class="ghost-button" type="button" data-remove="${item.id}">删除</button>
      </div>
    `;
    list.appendChild(node);
  });

  list.querySelectorAll<HTMLButtonElement>("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => editItem(button.dataset.edit ?? ""));
  });

  list.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.remove;
      if (!id) return;
      saveSchedule(getSchedule().filter((item) => item.id !== id));
      render();
    });
  });
}

function editItem(id: string): void {
  const item = getSchedule().find((entry) => entry.id === id);
  if (!item || !form) return;
  editingId = id;
  (form.elements.namedItem("title") as HTMLInputElement).value = item.title;
  (form.elements.namedItem("date") as HTMLInputElement).value = item.date;
  (form.elements.namedItem("start") as HTMLInputElement).value = item.start;
  (form.elements.namedItem("end") as HTMLInputElement).value = item.end;
  (form.elements.namedItem("status") as HTMLSelectElement).value = item.status;
  (form.elements.namedItem("note") as HTMLTextAreaElement).value = item.note;
  if (saveButton) saveButton.textContent = "更新安排";
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const next: ScheduleItem = {
    id: editingId ?? uid("schedule"),
    title: String(formData.get("title") ?? "").trim(),
    date: String(formData.get("date") ?? ""),
    start: String(formData.get("start") ?? ""),
    end: String(formData.get("end") ?? ""),
    status: String(formData.get("status") ?? "planned") as ScheduleItem["status"],
    note: String(formData.get("note") ?? "").trim()
  };

  if (!next.title) return;
  const items = getSchedule();
  const updated = editingId ? items.map((item) => (item.id === editingId ? next : item)) : [next, ...items];
  saveSchedule(updated);
  editingId = null;
  form.reset();
  if (saveButton) saveButton.textContent = "保存安排";
  setDefaults();
  render();
});

form?.addEventListener("reset", () => {
  editingId = null;
  if (saveButton) saveButton.textContent = "保存安排";
  window.setTimeout(setDefaults, 0);
});

filterDate?.addEventListener("change", render);

setDefaults();
render();
