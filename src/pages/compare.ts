import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("tools");

type ResultRow = {
  path: string;
  status: "only-a" | "match" | "only-b";
  detail: string;
};

const folderA = document.querySelector<HTMLInputElement>("#folderA");
const folderB = document.querySelector<HTMLInputElement>("#folderB");
const body = document.querySelector<HTMLTableSectionElement>("#compareTableBody");
const commandOutput = document.querySelector<HTMLTextAreaElement>("#commandOutput");

let lastResults: ResultRow[] = [];

function normalizedKey(file: File): string {
  const relative = (file as File & { webkitRelativePath?: string }).webkitRelativePath ?? file.name;
  const withoutRoot = relative.includes("/") ? relative.split("/").slice(1).join("/") : relative;
  const lastDot = withoutRoot.lastIndexOf(".");
  return lastDot > 0 ? withoutRoot.slice(0, lastDot) : withoutRoot;
}

function relativePath(file: File): string {
  const relative = (file as File & { webkitRelativePath?: string }).webkitRelativePath ?? file.name;
  return relative.includes("/") ? relative.split("/").slice(1).join("/") : relative;
}

function renderResults(): void {
  if (!body) return;
  body.innerHTML = "";
  if (lastResults.length === 0) {
    body.innerHTML = `<tr><td colspan="3"><div class="empty-state">还没有对比结果。</div></td></tr>`;
    return;
  }

  lastResults.forEach((result) => {
    const row = document.createElement("tr");
    const label = result.status === "match" ? "共有" : result.status === "only-a" ? "A 独有" : "B 独有";
    row.innerHTML = `
      <td>${result.path}</td>
      <td>${label}</td>
      <td>${result.detail}</td>
    `;
    body.appendChild(row);
  });

  document.querySelector("#onlyACount")!.textContent = `${lastResults.filter((row) => row.status === "only-a").length}`;
  document.querySelector("#matchCount")!.textContent = `${lastResults.filter((row) => row.status === "match").length}`;
  document.querySelector("#onlyBCount")!.textContent = `${lastResults.filter((row) => row.status === "only-b").length}`;
}

document.querySelector<HTMLButtonElement>("#compareButton")?.addEventListener("click", () => {
  const listA = Array.from(folderA?.files ?? []);
  const listB = Array.from(folderB?.files ?? []);
  if (listA.length === 0 || listB.length === 0) {
    window.alert("请先选择两个目录。");
    return;
  }

  const mapA = new Map(listA.map((file) => [normalizedKey(file), file]));
  const mapB = new Map(listB.map((file) => [normalizedKey(file), file]));
  const keys = new Set([...mapA.keys(), ...mapB.keys()]);

  lastResults = Array.from(keys)
    .sort()
    .map((key) => {
      const left = mapA.get(key);
      const right = mapB.get(key);
      if (left && right) {
        return { path: relativePath(left), status: "match", detail: "A/B 均存在，可考虑从 A 中清理。" };
      }
      if (left) {
        return { path: relativePath(left), status: "only-a", detail: "只在 A 中存在。" };
      }
      return { path: relativePath(right!), status: "only-b", detail: "只在 B 中存在。" };
    });

  const deletePaths = lastResults
    .filter((row) => row.status === "match")
    .map((row) => row.path.replaceAll("'", "''"));

  if (commandOutput) {
    commandOutput.value = deletePaths.length
      ? deletePaths.map((path) => `Remove-Item -LiteralPath '.\\${path}'`).join("\n")
      : "";
  }

  renderResults();
});

document.querySelector<HTMLButtonElement>("#copyCommandButton")?.addEventListener("click", async () => {
  if (!commandOutput?.value) return;
  await navigator.clipboard.writeText(commandOutput.value);
  window.alert("删除命令已复制。");
});

renderResults();
