import { saveAs } from "file-saver";
import JSZip from "jszip";
import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("tools");

type RenameEntry = {
  id: string;
  file: File;
  nextName: string;
};

const input = document.querySelector<HTMLInputElement>("#renameFileInput");
const prefixInput = document.querySelector<HTMLInputElement>("#renamePrefix");
const body = document.querySelector<HTMLTableSectionElement>("#renameTableBody");

let entries: RenameEntry[] = [];

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot) : "";
}

function baseNameOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(0, dot) : fileName;
}

function render(): void {
  if (!body) return;
  body.innerHTML = "";
  if (entries.length === 0) {
    body.innerHTML = `<tr><td colspan="3"><div class="empty-state">还没有导入任何文件。</div></td></tr>`;
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.file.name}</td>
      <td><input data-name="${entry.id}" value="${entry.nextName}" /></td>
      <td><button class="ghost-button" type="button" data-remove="${entry.id}">删除</button></td>
    `;
    body.appendChild(row);
  });

  body.querySelectorAll<HTMLInputElement>("[data-name]").forEach((field) => {
    field.addEventListener("input", () => {
      const id = field.dataset.name;
      entries = entries.map((entry) => (entry.id === id ? { ...entry, nextName: field.value } : entry));
    });
  });

  body.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.remove;
      entries = entries.filter((entry) => entry.id !== id);
      render();
    });
  });
}

input?.addEventListener("change", () => {
  const files = Array.from(input.files ?? []);
  entries = [
    ...entries,
    ...files.map((file) => ({
      id: `${file.name}-${crypto.randomUUID()}`,
      file,
      nextName: baseNameOf(file.name)
    }))
  ];
  input.value = "";
  render();
});

document.querySelector<HTMLButtonElement>("#autoRenameButton")?.addEventListener("click", () => {
  const prefix = prefixInput?.value.trim();
  entries = entries.map((entry, index) => ({
    ...entry,
    nextName: prefix ? `${prefix}_${index + 1}` : `${index + 1}`
  }));
  render();
});

document.querySelector<HTMLButtonElement>("#clearRenameButton")?.addEventListener("click", () => {
  entries = [];
  render();
});

document.querySelector<HTMLButtonElement>("#downloadZipButton")?.addEventListener("click", async () => {
  if (entries.length === 0) return;
  const zip = new JSZip();
  for (const entry of entries) {
    const blob = await entry.file.arrayBuffer();
    zip.file(`${entry.nextName}${extensionOf(entry.file.name)}`, blob);
  }
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "renamed-files.zip");
});

render();
