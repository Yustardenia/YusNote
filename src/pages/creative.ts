
import DOMPurify from "dompurify";
import { marked } from "marked";
import { initAppShell } from "../lib/base";
import {
  listCreativeDocs,
  saveCreativeDoc,
  deleteCreativeDoc,
  listBoardProjects,
  saveBoardProject,
  listMindMapProjects,
  saveMindMapProject,
  listMermaidSnippets,
  saveMermaidSnippet
} from "../lib/storage";
import type {
  CreativeDoc,
  CreativeBoardProject,
  BoardTextElement,
  MermaidSnippet,
  MermaidTemplateKind,
  MindMapNode,
  MindMapProject,
  BoardTool
} from "../lib/types";
import { escapeHtml, uid } from "../lib/utils";
import "../styles/global.css";

initAppShell("tools");

type CreativeTab = "markdown" | "board" | "mindmap" | "mermaid";
type BoardSnapshot = { raster: string; notes: BoardTextElement[] };

const tabs = [...document.querySelectorAll<HTMLButtonElement>("[data-creative-tab]")];
const panels = [...document.querySelectorAll<HTMLElement>("[data-creative-panel]")];
const docList = document.querySelector<HTMLUListElement>("#docList");
const docSearchInput = document.querySelector<HTMLInputElement>("#docSearchInput");
const markdownInput = document.querySelector<HTMLTextAreaElement>("#markdownInput");
const markdownPreview = document.querySelector<HTMLElement>("#markdownPreview");
const markdownWorkspace = document.querySelector<HTMLElement>("#markdownWorkspace");
const boardProjectList = document.querySelector<HTMLUListElement>("#boardProjectList");
const boardStage = document.querySelector<HTMLElement>("#boardStage");
const boardColorInput = document.querySelector<HTMLInputElement>("#boardColorInput");
const boardSizeInput = document.querySelector<HTMLInputElement>("#boardSizeInput");
const mindMapList = document.querySelector<HTMLUListElement>("#mindMapList");
const mindMapStage = document.querySelector<SVGSVGElement>("#mindMapStage");
const mindMapColorInput = document.querySelector<HTMLInputElement>("#mindMapColorInput");
const mermaidInput = document.querySelector<HTMLTextAreaElement>("#mermaidInput");
const mermaidPreview = document.querySelector<HTMLElement>("#mermaidPreview");
const mermaidSnippetList = document.querySelector<HTMLUListElement>("#mermaidSnippetList");

let docs: CreativeDoc[] = [];
let activeDocId = "";
let boardProjects: CreativeBoardProject[] = [];
let activeBoardProjectId = "";
let boardTool: BoardTool = "select";
let boardSelectionId = "";
let boardCanvas: HTMLCanvasElement | null = null;
let boardCtx: CanvasRenderingContext2D | null = null;
let drawing = false;
let drawStart: { x: number; y: number } | null = null;
let drawPreviewImage = "";
let noteDrag: { id: string; offsetX: number; offsetY: number } | null = null;
let boardHistory: BoardSnapshot[] = [];
let boardFuture: BoardSnapshot[] = [];
let mindMaps: MindMapProject[] = [];
let activeMindMapId = "";
let selectedMindMapNodeId = "";
let mermaidSnippets: MermaidSnippet[] = [];
let activeMermaidSnippetId = "";
let mermaidModule: typeof import("mermaid") | null = null;
let pdfjsModule: typeof import("pdfjs-dist") | null = null;

const markdownTemplates: Record<string, string> = {
  h1: "# 标题\n",
  h2: "## 小节标题\n",
  list: "- 第一项\n- 第二项\n",
  task: "- [ ] 待办一\n- [ ] 待办二\n",
  quote: "> 一段引用\n",
  code: "```ts\nconsole.log('hello');\n```\n",
  table: "| 列一 | 列二 |\n| --- | --- |\n| 内容 | 内容 |\n",
  callout: "> [!NOTE]\n> 写一段提醒。\n",
  mermaid: "```mermaid\ngraph TD\n  A --> B\n```\n"
};

const mermaidTemplates: Record<MermaidTemplateKind, string> = {
  flowchart: "flowchart TD\n  灵感 --> 草稿 --> 发布",
  sequence: "sequenceDiagram\n  你->>页面: 打开 Creative\n  页面-->>你: 恢复工程",
  gantt: "gantt\n  title 今晚推进\n  dateFormat YYYY-MM-DD\n  section 页面\n  重构 :a1, 2026-03-12, 2d",
  state: "stateDiagram-v2\n  [*] --> 草稿\n  草稿 --> 完成\n  完成 --> [*]",
  class: "classDiagram\n  class CreativeDoc\n  class MermaidSnippet\n  CreativeDoc --> MermaidSnippet",
  er: "erDiagram\n  DOC ||--o{ SNIPPET : contains",
  journey: "journey\n  title 晚上的整理\n  section 工作台\n    写草稿: 5: 你\n    画脑图: 4: 你",
  mindmap: "mindmap\n  root((Creative))\n    Markdown\n    白板\n    Mermaid"
};

function nowIso(): string { return new Date().toISOString(); }
function createDoc(name = "未命名文档"): CreativeDoc { return { id: uid("doc"), name, content: "# 新文档\n\n从这里开始写。", createdAt: nowIso(), updatedAt: nowIso() }; }
function createBoardProject(name = "白板工程"): CreativeBoardProject { const pageId = uid("page"); return { id: uid("board"), name, updatedAt: nowIso(), activePageId: pageId, pages: [{ id: pageId, name: "Page 1", elements: [] }] }; }
function createMindMapNode(text: string, x: number, y: number): MindMapNode { return { id: uid("node"), text, color: "#6e6cff", collapsed: false, x, y, children: [] }; }
function createMindMapProject(name = "脑图"): MindMapProject { return { id: uid("mindmap"), name, updatedAt: nowIso(), rootNode: createMindMapNode("中心主题", 500, 120) }; }
function createSnippet(name = "新 Mermaid"): MermaidSnippet { return { id: uid("mermaid"), name, code: mermaidTemplates.flowchart, templateKind: "flowchart", updatedAt: nowIso() }; }

function switchTab(tab: CreativeTab): void {
  tabs.forEach((button) => { button.dataset.active = button.dataset.creativeTab === tab ? "true" : "false"; });
  panels.forEach((panel) => { panel.hidden = panel.dataset.creativePanel !== tab; });
  if (tab === "mermaid") void renderMermaid();
}

tabs.forEach((button) => button.addEventListener("click", () => switchTab((button.dataset.creativeTab as CreativeTab) ?? "markdown")));

function getActiveDoc(): CreativeDoc | undefined { return docs.find((item) => item.id === activeDocId); }
function getActiveBoard(): CreativeBoardProject | undefined { return boardProjects.find((item) => item.id === activeBoardProjectId); }
function getBoardPage(project = getActiveBoard()) { return project?.pages.find((page) => page.id === project.activePageId); }
function getBoardRaster(page = getBoardPage()): string { return (page?.elements.find((item) => item.type === "asset" && item.id === "board-raster") as any)?.src ?? ""; }
function getBoardNotes(page = getBoardPage()): BoardTextElement[] { return (page?.elements.filter((item) => item.type === "note" || item.type === "text") as BoardTextElement[]) ?? []; }

async function setBoardState(raster: string, notes: BoardTextElement[]): Promise<void> {
  const project = getActiveBoard();
  const page = getBoardPage(project);
  if (!project || !page) return;
  const elements: any[] = [];
  if (raster) elements.push({ id: "board-raster", type: "asset", assetType: "image", src: raster, label: "board", x: 0, y: 0, width: 1800, height: 1100, color: "#000", createdAt: nowIso() });
  elements.push(...notes);
  const next: CreativeBoardProject = { ...project, updatedAt: nowIso(), pages: project.pages.map((item) => (item.id === page.id ? { ...item, elements } : item)) };
  await saveBoardProject(next);
  boardProjects = boardProjects.map((item) => (item.id === next.id ? next : item));
  renderBoardProjectList();
  renderBoard();
}

function pushBoardHistory(): void { boardHistory.push({ raster: getBoardRaster(), notes: structuredClone(getBoardNotes()) }); if (boardHistory.length > 30) boardHistory.shift(); boardFuture = []; }
function renderDocList(): void {
  if (!docList) return;
  const query = docSearchInput?.value.trim().toLowerCase() ?? "";
  docList.innerHTML = docs.filter((item) => item.name.toLowerCase().includes(query)).map((doc) => `<li><button class="workspace-item" type="button" data-doc-id="${doc.id}" data-active="${doc.id === activeDocId}"><strong>${escapeHtml(doc.name)}</strong><span>${new Date(doc.updatedAt).toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span></button></li>`).join("");
  docList.querySelectorAll<HTMLButtonElement>("[data-doc-id]").forEach((button) => button.addEventListener("click", () => { activeDocId = button.dataset.docId ?? activeDocId; renderDocList(); renderActiveDoc(); }));
}

function renderActiveDoc(): void {
  const doc = getActiveDoc();
  if (!doc || !markdownInput || !markdownPreview) return;
  markdownInput.value = doc.content;
  markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(doc.content) as string);
}

async function loadDocs(): Promise<void> {
  docs = await listCreativeDocs();
  if (docs.length === 0) { const doc = createDoc(); await saveCreativeDoc(doc); docs = [doc]; }
  activeDocId = docs[0].id;
  renderDocList();
  renderActiveDoc();
}

docSearchInput?.addEventListener("input", renderDocList);
markdownInput?.addEventListener("input", async () => {
  const active = getActiveDoc();
  if (!active || !markdownInput || !markdownPreview) return;
  const next = { ...active, content: markdownInput.value, updatedAt: nowIso() };
  await saveCreativeDoc(next);
  docs = docs.map((item) => (item.id === next.id ? next : item));
  markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(markdownInput.value) as string);
  renderDocList();
});

document.querySelectorAll<HTMLButtonElement>("[data-md-insert]").forEach((button) => button.addEventListener("click", () => {
  if (!markdownInput) return;
  const insert = markdownTemplates[button.dataset.mdInsert ?? ""];
  if (!insert) return;
  markdownInput.setRangeText(insert, markdownInput.selectionStart, markdownInput.selectionEnd, "end");
  markdownInput.dispatchEvent(new Event("input"));
}));

document.querySelector<HTMLButtonElement>("#createDocButton")?.addEventListener("click", async () => {
  const doc = createDoc(window.prompt("文档名", `文档 ${docs.length + 1}`)?.trim() || `文档 ${docs.length + 1}`);
  await saveCreativeDoc(doc);
  docs = [doc, ...docs];
  activeDocId = doc.id;
  renderDocList();
  renderActiveDoc();
});

document.querySelector<HTMLButtonElement>("#renameDocButton")?.addEventListener("click", async () => {
  const active = getActiveDoc(); if (!active) return;
  const name = window.prompt("重命名文档", active.name)?.trim(); if (!name) return;
  const next = { ...active, name, updatedAt: nowIso() };
  await saveCreativeDoc(next); docs = docs.map((item) => (item.id === next.id ? next : item)); renderDocList();
});

document.querySelector<HTMLButtonElement>("#duplicateDocButton")?.addEventListener("click", async () => {
  const active = getActiveDoc(); if (!active) return;
  const clone = { ...active, id: uid("doc"), name: `${active.name} 副本`, createdAt: nowIso(), updatedAt: nowIso() };
  await saveCreativeDoc(clone); docs = [clone, ...docs]; activeDocId = clone.id; renderDocList(); renderActiveDoc();
});

document.querySelector<HTMLButtonElement>("#deleteDocButton")?.addEventListener("click", async () => {
  const active = getActiveDoc(); if (!active || docs.length === 1) return;
  if (!window.confirm(`删除 ${active.name}？`)) return;
  await deleteCreativeDoc(active.id); docs = docs.filter((item) => item.id !== active.id); activeDocId = docs[0].id; renderDocList(); renderActiveDoc();
});

document.querySelector<HTMLButtonElement>("#toggleDocPreviewButton")?.addEventListener("click", () => {
  if (!markdownWorkspace) return;
  markdownWorkspace.dataset.previewMode = markdownWorkspace.dataset.previewMode === "preview" ? "split" : markdownWorkspace.dataset.previewMode === "split" ? "editor" : "preview";
});

const docImportInput = document.querySelector<HTMLInputElement>("#docImportInput");
document.querySelector<HTMLButtonElement>("#importDocButton")?.addEventListener("click", () => docImportInput?.click());
docImportInput?.addEventListener("change", async () => {
  const file = docImportInput.files?.[0]; if (!file) return;
  const doc = createDoc(file.name.replace(/\.md$/i, "")); doc.content = await file.text(); await saveCreativeDoc(doc);
  docs = [doc, ...docs]; activeDocId = doc.id; renderDocList(); renderActiveDoc(); docImportInput.value = "";
});

document.querySelector<HTMLButtonElement>("#exportDocButton")?.addEventListener("click", () => {
  const active = getActiveDoc(); if (!active) return;
  downloadBlob(`${active.name}.md`, new Blob([active.content], { type: "text/markdown;charset=utf-8" }));
});

async function loadBoards(): Promise<void> {
  boardProjects = await listBoardProjects();
  if (boardProjects.length === 0) { const project = createBoardProject(); await saveBoardProject(project); boardProjects = [project]; }
  activeBoardProjectId = boardProjects[0].id; renderBoardProjectList(); renderBoard();
}

function renderBoardProjectList(): void {
  if (!boardProjectList) return;
  boardProjectList.innerHTML = boardProjects.map((project) => `<li><button class="workspace-item" type="button" data-board-id="${project.id}" data-active="${project.id === activeBoardProjectId}"><strong>${escapeHtml(project.name)}</strong><span>${new Date(project.updatedAt).toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span></button></li>`).join("");
  boardProjectList.querySelectorAll<HTMLButtonElement>("[data-board-id]").forEach((button) => button.addEventListener("click", () => { activeBoardProjectId = button.dataset.boardId ?? activeBoardProjectId; boardHistory = []; boardFuture = []; renderBoardProjectList(); renderBoard(); }));
}

function stagePoint(event: PointerEvent) { const rect = boardStage!.getBoundingClientRect(); return { x: ((event.clientX - rect.left) / rect.width) * 1800, y: ((event.clientY - rect.top) / rect.height) * 1100 }; }

function renderBoard(): void {
  if (!boardStage) return;
  const raster = getBoardRaster(); const notes = getBoardNotes();
  boardStage.innerHTML = `<canvas id="boardCanvas" width="1800" height="1100"></canvas>${notes.map((note) => `<div class="board-note ${note.id === boardSelectionId ? "is-selected" : ""}" data-note-id="${note.id}" style="left:${note.x}px;top:${note.y}px;width:${note.width}px;min-height:${note.height}px;color:${note.color};background:${note.background ?? "rgba(255,246,202,.96)"};font-size:${note.fontSize}px">${escapeHtml(note.text).replace(/\n/g, "<br />")}</div>`).join("")}`;
  boardCanvas = boardStage.querySelector<HTMLCanvasElement>("#boardCanvas"); boardCtx = boardCanvas?.getContext("2d") ?? null;
  if (boardCtx) {
    boardCtx.fillStyle = "#ffffff"; boardCtx.fillRect(0, 0, 1800, 1100);
    if (raster) { const image = new Image(); image.src = raster; image.onload = () => boardCtx?.drawImage(image, 0, 0, 1800, 1100); }
  }
  boardStage.querySelectorAll<HTMLElement>("[data-note-id]").forEach((note) => note.addEventListener("pointerdown", (event) => {
    boardSelectionId = note.dataset.noteId ?? ""; renderBoard(); if (boardTool !== "select") return;
    const point = stagePoint(event); const current = getBoardNotes().find((item) => item.id === boardSelectionId); if (!current) return;
    noteDrag = { id: current.id, offsetX: point.x - current.x, offsetY: point.y - current.y };
  }));
}

function serializeBoardRaster(): string { return boardCanvas?.toDataURL("image/png") ?? ""; }
async function commitBoardRaster(): Promise<void> { await setBoardState(serializeBoardRaster(), getBoardNotes()); }

async function sendBoardToMarkdown(): Promise<void> {
  const raster = serializeBoardRaster();
  if (!raster) return;
  const active = getActiveDoc();
  if (!active) return;
  const snippet = `\n![白板快照](${raster})\n`;
  const next = {
    ...active,
    content: `${active.content.trimEnd()}\n${snippet}`,
    updatedAt: nowIso()
  };
  await saveCreativeDoc(next);
  docs = docs.map((item) => (item.id === next.id ? next : item));
  activeDocId = next.id;
  renderDocList();
  renderActiveDoc();
  switchTab("markdown");
}

document.querySelectorAll<HTMLButtonElement>("[data-board-tool]").forEach((button) => button.addEventListener("click", () => {
  boardTool = (button.dataset.boardTool as BoardTool) ?? "select";
  document.querySelectorAll<HTMLButtonElement>("[data-board-tool]").forEach((node) => (node.dataset.active = node === button ? "true" : "false"));
}));

document.querySelector<HTMLButtonElement>("#createBoardProjectButton")?.addEventListener("click", async () => {
  const project = createBoardProject(window.prompt("工程名", `白板 ${boardProjects.length + 1}`)?.trim() || `白板 ${boardProjects.length + 1}`);
  await saveBoardProject(project); boardProjects = [project, ...boardProjects]; activeBoardProjectId = project.id; renderBoardProjectList(); renderBoard();
});
boardStage?.addEventListener("pointerdown", (event) => {
  const target = event.target as HTMLElement;
  if (target.closest("[data-note-id]")) return;
  if (!boardCtx) return;
  const point = stagePoint(event);
  if (boardTool === "text" || boardTool === "note") {
    const text = window.prompt(boardTool === "text" ? "输入文本" : "输入便签");
    if (!text) return;
    pushBoardHistory();
    const note: BoardTextElement = { id: uid("note"), type: boardTool, text, x: point.x, y: point.y, width: boardTool === "text" ? 320 : 240, height: boardTool === "text" ? 80 : 140, color: "#2f2543", background: boardTool === "text" ? "rgba(255,255,255,.9)" : "rgba(255,246,202,.96)", fontSize: boardTool === "text" ? 22 : 20, createdAt: nowIso() };
    void setBoardState(getBoardRaster(), [...getBoardNotes(), note]);
    return;
  }
  drawing = true; drawStart = point; drawPreviewImage = serializeBoardRaster();
  if (boardTool === "pen" || boardTool === "highlighter" || boardTool === "eraser") { boardCtx.beginPath(); boardCtx.moveTo(point.x, point.y); }
});

boardStage?.addEventListener("pointermove", (event) => {
  if (noteDrag) {
    const point = stagePoint(event);
    const nextNotes = getBoardNotes().map((item) => (item.id === noteDrag!.id ? { ...item, x: point.x - noteDrag!.offsetX, y: point.y - noteDrag!.offsetY } : item));
    void setBoardState(getBoardRaster(), nextNotes);
    return;
  }
  if (!drawing || !boardCtx || !drawStart) return;
  const point = stagePoint(event);
  if (boardTool === "pen" || boardTool === "highlighter" || boardTool === "eraser") {
    boardCtx.strokeStyle = boardTool === "eraser" ? "#ffffff" : boardColorInput?.value ?? "#d36ea0";
    boardCtx.globalAlpha = boardTool === "highlighter" ? 0.35 : 1;
    boardCtx.lineWidth = Number(boardSizeInput?.value ?? 5);
    boardCtx.lineCap = "round";
    boardCtx.lineTo(point.x, point.y);
    boardCtx.stroke();
    boardCtx.globalAlpha = 1;
    return;
  }
  const image = new Image(); image.src = drawPreviewImage;
  image.onload = () => {
    boardCtx?.clearRect(0, 0, 1800, 1100); boardCtx?.drawImage(image, 0, 0); if (!boardCtx) return;
    boardCtx.strokeStyle = boardColorInput?.value ?? "#d36ea0"; boardCtx.lineWidth = Number(boardSizeInput?.value ?? 5);
    if (boardTool === "line" || boardTool === "arrow") { boardCtx.beginPath(); boardCtx.moveTo(drawStart!.x, drawStart!.y); boardCtx.lineTo(point.x, point.y); boardCtx.stroke(); }
    else if (boardTool === "rect") boardCtx.strokeRect(drawStart!.x, drawStart!.y, point.x - drawStart!.x, point.y - drawStart!.y);
    else if (boardTool === "ellipse") { boardCtx.beginPath(); boardCtx.ellipse((drawStart!.x + point.x) / 2, (drawStart!.y + point.y) / 2, Math.abs(point.x - drawStart!.x) / 2, Math.abs(point.y - drawStart!.y) / 2, 0, 0, Math.PI * 2); boardCtx.stroke(); }
  };
});

window.addEventListener("pointerup", () => {
  if (noteDrag) { noteDrag = null; return; }
  if (!drawing) return;
  drawing = false; pushBoardHistory(); void commitBoardRaster();
});

document.querySelector<HTMLButtonElement>("#undoBoardButton")?.addEventListener("click", async () => {
  if (boardHistory.length === 0) return;
  boardFuture.push({ raster: getBoardRaster(), notes: structuredClone(getBoardNotes()) });
  const snapshot = boardHistory.pop()!; await setBoardState(snapshot.raster, snapshot.notes);
});

document.querySelector<HTMLButtonElement>("#redoBoardButton")?.addEventListener("click", async () => {
  if (boardFuture.length === 0) return;
  boardHistory.push({ raster: getBoardRaster(), notes: structuredClone(getBoardNotes()) });
  const snapshot = boardFuture.pop()!; await setBoardState(snapshot.raster, snapshot.notes);
});

document.querySelector<HTMLButtonElement>("#clearBoardButton")?.addEventListener("click", async () => {
  if (!window.confirm("清空当前白板？")) return; pushBoardHistory(); await setBoardState("", []);
});

document.querySelector<HTMLButtonElement>("#exportBoardJsonButton")?.addEventListener("click", () => {
  const project = getActiveBoard(); if (!project) return;
  downloadBlob(`${project.name}.json`, new Blob([JSON.stringify(project, null, 2)], { type: "application/json" }));
});

document.querySelector<HTMLButtonElement>("#exportBoardPngButton")?.addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas"); exportCanvas.width = 1800; exportCanvas.height = 1100;
  const ctx = exportCanvas.getContext("2d"); if (!ctx || !boardCanvas) return; ctx.drawImage(boardCanvas, 0, 0);
  getBoardNotes().forEach((note) => {
    ctx.fillStyle = note.background ?? "rgba(255,246,202,.96)"; ctx.fillRect(note.x, note.y, note.width, note.height);
    ctx.fillStyle = note.color; ctx.font = `${note.fontSize}px sans-serif`; wrapCanvasText(ctx, note.text, note.x + 18, note.y + 32, note.width - 32, note.fontSize + 10);
  });
  exportCanvas.toBlob((blob) => blob && downloadBlob("board.png", blob), "image/png");
});
document.querySelector<HTMLButtonElement>("#sendBoardToMarkdownButton")?.addEventListener("click", () => {
  void sendBoardToMarkdown();
});

const boardImageInput = document.querySelector<HTMLInputElement>("#boardImageInput");
document.querySelector<HTMLButtonElement>("#importBoardImageButton")?.addEventListener("click", () => boardImageInput?.click());
boardImageInput?.addEventListener("change", async () => {
  const file = boardImageInput.files?.[0]; if (!file || !boardCtx) return; pushBoardHistory();
  const image = new Image(); image.src = await fileToDataUrl(file); image.onload = async () => { boardCtx?.drawImage(image, 100, 100, 600, 360); await commitBoardRaster(); }; boardImageInput.value = "";
});

const boardPdfInput = document.querySelector<HTMLInputElement>("#boardPdfInput");
document.querySelector<HTMLButtonElement>("#importBoardPdfButton")?.addEventListener("click", () => boardPdfInput?.click());
boardPdfInput?.addEventListener("change", async () => {
  const file = boardPdfInput.files?.[0]; if (!file || !boardCtx) return; pushBoardHistory(); const pages = await renderPdfToImages(file);
  pages.slice(0, 3).forEach((src, index) => { const image = new Image(); image.src = src; image.onload = () => { boardCtx?.drawImage(image, 80 + index * 120, 80 + index * 40, 480, 640); void commitBoardRaster(); }; });
  boardPdfInput.value = "";
});

document.querySelector<HTMLButtonElement>("#importMarkdownCardsButton")?.addEventListener("click", async () => {
  const active = getActiveDoc(); if (!active) return; pushBoardHistory();
  const notes = active.content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 8).map((line, index) => ({ id: uid("note"), type: "note" as const, text: line.replace(/^#+\s*/, "").replace(/^[-*]\s*/, ""), x: 90 + (index % 3) * 260, y: 90 + Math.floor(index / 3) * 170, width: 220, height: 130, color: "#2f2543", background: "rgba(255,246,202,.96)", fontSize: 20, createdAt: nowIso() }));
  await setBoardState(getBoardRaster(), [...getBoardNotes(), ...notes]);
});

async function loadMindMaps(): Promise<void> {
  mindMaps = await listMindMapProjects();
  if (mindMaps.length === 0) { const project = createMindMapProject(); await saveMindMapProject(project); mindMaps = [project]; }
  activeMindMapId = mindMaps[0].id; selectedMindMapNodeId = mindMaps[0].rootNode.id; renderMindMapList(); renderMindMap();
}

function getActiveMindMap(): MindMapProject | undefined { return mindMaps.find((item) => item.id === activeMindMapId); }
function walk(node: MindMapNode, fn: (node: MindMapNode, parent?: MindMapNode) => void, parent?: MindMapNode): void { fn(node, parent); if (node.collapsed) return; node.children.forEach((child) => walk(child, fn, node)); }
function findNode(root: MindMapNode, id: string): MindMapNode | undefined { if (root.id === id) return root; for (const child of root.children) { const found = findNode(child, id); if (found) return found; } }
function findParent(root: MindMapNode, id: string, parent?: MindMapNode): MindMapNode | undefined { if (root.id === id) return parent; for (const child of root.children) { const found = findParent(child, id, root); if (found) return found; } }
function renderMindMapList(): void {
  if (!mindMapList) return;
  mindMapList.innerHTML = mindMaps.map((project) => `<li><button class="workspace-item" type="button" data-mindmap-id="${project.id}" data-active="${project.id === activeMindMapId}"><strong>${escapeHtml(project.name)}</strong><span>${new Date(project.updatedAt).toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span></button></li>`).join("");
  mindMapList.querySelectorAll<HTMLButtonElement>("[data-mindmap-id]").forEach((button) => button.addEventListener("click", () => { activeMindMapId = button.dataset.mindmapId ?? activeMindMapId; selectedMindMapNodeId = getActiveMindMap()?.rootNode.id ?? selectedMindMapNodeId; renderMindMapList(); renderMindMap(); }));
}

async function patchMindMap(mutator: (root: MindMapNode) => void): Promise<void> {
  const current = getActiveMindMap(); if (!current) return;
  const root = structuredClone(current.rootNode); mutator(root);
  const next = { ...current, rootNode: root, updatedAt: nowIso() };
  await saveMindMapProject(next); mindMaps = mindMaps.map((item) => (item.id === next.id ? next : item)); renderMindMapList(); renderMindMap();
}

function renderMindMap(): void {
  const current = getActiveMindMap(); if (!mindMapStage || !current) return;
  const edges: string[] = []; const nodes: string[] = [];
  walk(current.rootNode, (node, parent) => {
    if (parent) edges.push(`<line class="mindmap-edge" x1="${parent.x}" y1="${parent.y}" x2="${node.x}" y2="${node.y}" />`);
    const width = Math.max(150, node.text.length * 22 + 30);
    nodes.push(`<g class="mindmap-node ${node.id === selectedMindMapNodeId ? "is-selected" : ""}" data-node-id="${node.id}" transform="translate(${node.x - width / 2}, ${node.y - 28})"><rect width="${width}" height="56" rx="18" fill="${node.color}" /><text x="${width / 2}" y="34" text-anchor="middle">${escapeHtml(node.text)}</text></g>`);
  });
  mindMapStage.setAttribute("viewBox", "0 0 1000 640"); mindMapStage.innerHTML = `${edges.join("")}${nodes.join("")}`;
  mindMapStage.querySelectorAll<SVGGElement>("[data-node-id]").forEach((node) => node.addEventListener("click", () => { selectedMindMapNodeId = node.dataset.nodeId ?? selectedMindMapNodeId; renderMindMap(); }));
}

document.querySelector<HTMLButtonElement>("#createMindMapButton")?.addEventListener("click", async () => {
  const project = createMindMapProject(window.prompt("脑图名称", `脑图 ${mindMaps.length + 1}`)?.trim() || `脑图 ${mindMaps.length + 1}`);
  await saveMindMapProject(project); mindMaps = [project, ...mindMaps]; activeMindMapId = project.id; selectedMindMapNodeId = project.rootNode.id; renderMindMapList(); renderMindMap();
});

document.querySelector<HTMLButtonElement>("#buildMindMapFromDocButton")?.addEventListener("click", async () => {
  const doc = getActiveDoc(); if (!doc) return;
  const project = createMindMapProject(`${doc.name} 脑图`); const stack: Array<{ level: number; node: MindMapNode }> = [{ level: 1, node: project.rootNode }]; let row = 0;
  doc.content.split(/\r?\n/).forEach((line) => { const match = line.match(/^(#{1,6})\s+(.+)$/); if (!match) return; const level = match[1].length; const node = createMindMapNode(match[2].trim(), 220 + level * 120, 220 + row * 90); while (stack.length && stack[stack.length - 1].level >= level) stack.pop(); (stack[stack.length - 1]?.node ?? project.rootNode).children.push(node); stack.push({ level, node }); row += 1; });
  await saveMindMapProject(project); mindMaps = [project, ...mindMaps]; activeMindMapId = project.id; selectedMindMapNodeId = project.rootNode.id; renderMindMapList(); renderMindMap();
});

document.querySelector<HTMLButtonElement>("#addMindMapChildButton")?.addEventListener("click", () => void patchMindMap((root) => { const node = findNode(root, selectedMindMapNodeId); if (node) node.children.push(createMindMapNode("新节点", node.x + 180, node.y + node.children.length * 90 + 30)); }));
document.querySelector<HTMLButtonElement>("#addMindMapSiblingButton")?.addEventListener("click", () => void patchMindMap((root) => { const parent = findParent(root, selectedMindMapNodeId); if (parent) parent.children.push(createMindMapNode("同级节点", parent.x + 180, parent.y + parent.children.length * 90 + 30)); }));
document.querySelector<HTMLButtonElement>("#renameMindMapNodeButton")?.addEventListener("click", () => {
  const current = getActiveMindMap(); const node = current ? findNode(current.rootNode, selectedMindMapNodeId) : undefined; const text = window.prompt("节点名称", node?.text ?? "")?.trim(); if (!text) return;
  void patchMindMap((root) => { const target = findNode(root, selectedMindMapNodeId); if (target) target.text = text; });
});
document.querySelector<HTMLButtonElement>("#toggleMindMapNodeButton")?.addEventListener("click", () => void patchMindMap((root) => { const node = findNode(root, selectedMindMapNodeId); if (node) node.collapsed = !node.collapsed; }));
mindMapColorInput?.addEventListener("input", () => void patchMindMap((root) => { const node = findNode(root, selectedMindMapNodeId); if (node) node.color = mindMapColorInput.value; }));
document.querySelector<HTMLButtonElement>("#deleteMindMapNodeButton")?.addEventListener("click", () => void patchMindMap((root) => { const parent = findParent(root, selectedMindMapNodeId); if (!parent) return; parent.children = parent.children.filter((item) => item.id !== selectedMindMapNodeId); selectedMindMapNodeId = root.id; }));
document.querySelector<HTMLButtonElement>("#exportMindMapJsonButton")?.addEventListener("click", () => { const current = getActiveMindMap(); if (current) downloadBlob(`${current.name}.json`, new Blob([JSON.stringify(current, null, 2)], { type: "application/json" })); });
document.querySelector<HTMLButtonElement>("#exportMindMapPngButton")?.addEventListener("click", () => { const svg = mindMapStage?.outerHTML; if (svg) downloadBlob("mindmap.svg", new Blob([svg], { type: "image/svg+xml;charset=utf-8" })); });

async function loadMermaidData(): Promise<void> {
  mermaidSnippets = await listMermaidSnippets();
  if (mermaidSnippets.length === 0) { const snippet = createSnippet(); await saveMermaidSnippet(snippet); mermaidSnippets = [snippet]; }
  activeMermaidSnippetId = mermaidSnippets[0].id; renderSnippetList(); renderActiveSnippet();
}

function getActiveSnippet(): MermaidSnippet | undefined { return mermaidSnippets.find((item) => item.id === activeMermaidSnippetId); }
function renderSnippetList(): void {
  if (!mermaidSnippetList) return;
  mermaidSnippetList.innerHTML = mermaidSnippets.map((snippet) => `<li><button class="workspace-item" type="button" data-snippet-id="${snippet.id}" data-active="${snippet.id === activeMermaidSnippetId}"><strong>${escapeHtml(snippet.name)}</strong><span>${snippet.templateKind}</span></button></li>`).join("");
  mermaidSnippetList.querySelectorAll<HTMLButtonElement>("[data-snippet-id]").forEach((button) => button.addEventListener("click", () => { activeMermaidSnippetId = button.dataset.snippetId ?? activeMermaidSnippetId; renderSnippetList(); renderActiveSnippet(); }));
}
function renderActiveSnippet(): void { const current = getActiveSnippet(); if (mermaidInput && current) mermaidInput.value = current.code; }

async function getMermaid() {
  if (!mermaidModule) { mermaidModule = await import("mermaid"); mermaidModule.default.initialize({ startOnLoad: false, theme: "neutral" }); }
  return mermaidModule;
}

async function renderMermaid(): Promise<void> {
  if (!mermaidInput || !mermaidPreview) return;
  const code = mermaidInput.value.trim();
  if (!code) { mermaidPreview.innerHTML = `<div class="empty-state">还没有 Mermaid 代码。</div>`; return; }
  mermaidPreview.innerHTML = `<div class="mermaid"></div>`;
  const node = mermaidPreview.querySelector(".mermaid") as HTMLElement; node.textContent = code;
  try { const mermaid = await getMermaid(); await mermaid.default.run({ nodes: [node] }); }
  catch (error) { mermaidPreview.innerHTML = `<div class="empty-state">Mermaid 渲染失败：${escapeHtml(String(error))}</div>`; }
}

document.querySelectorAll<HTMLButtonElement>("[data-mermaid-template]").forEach((button) => button.addEventListener("click", () => { const kind = button.dataset.mermaidTemplate as MermaidTemplateKind; if (mermaidInput) { mermaidInput.value = mermaidTemplates[kind]; void renderMermaid(); } }));
document.querySelector<HTMLButtonElement>("#renderMermaidButton")?.addEventListener("click", () => void renderMermaid());
document.querySelector<HTMLButtonElement>("#createMermaidSnippetButton")?.addEventListener("click", async () => { const snippet = createSnippet(window.prompt("片段名称", `Mermaid ${mermaidSnippets.length + 1}`)?.trim() || `Mermaid ${mermaidSnippets.length + 1}`); await saveMermaidSnippet(snippet); mermaidSnippets = [snippet, ...mermaidSnippets]; activeMermaidSnippetId = snippet.id; renderSnippetList(); renderActiveSnippet(); });
document.querySelector<HTMLButtonElement>("#saveMermaidSnippetButton")?.addEventListener("click", async () => {
  if (!mermaidInput) return;
  const current = getActiveSnippet();
  const snippet: MermaidSnippet = { id: current?.id ?? uid("mermaid"), name: window.prompt("片段名称", current?.name ?? "新 Mermaid")?.trim() || current?.name || "新 Mermaid", code: mermaidInput.value, templateKind: guessMermaidKind(mermaidInput.value), updatedAt: nowIso() };
  await saveMermaidSnippet(snippet); mermaidSnippets = [snippet, ...mermaidSnippets.filter((item) => item.id !== snippet.id)]; activeMermaidSnippetId = snippet.id; renderSnippetList();
});
document.querySelector<HTMLButtonElement>("#exportMermaidSvgButton")?.addEventListener("click", () => { const svg = mermaidPreview?.querySelector("svg"); if (svg) downloadBlob("mermaid.svg", new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" })); });
function guessMermaidKind(code: string): MermaidTemplateKind {
  const normalized = code.trim().toLowerCase();
  if (normalized.startsWith("sequencediagram")) return "sequence";
  if (normalized.startsWith("gantt")) return "gantt";
  if (normalized.startsWith("state")) return "state";
  if (normalized.startsWith("classdiagram")) return "class";
  if (normalized.startsWith("erdiagram")) return "er";
  if (normalized.startsWith("journey")) return "journey";
  if (normalized.startsWith("mindmap")) return "mindmap";
  return "flowchart";
}

function downloadBlob(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("文件读取失败"));
    reader.readAsDataURL(file);
  });
}

async function getPdfJs() {
  if (!pdfjsModule) {
    pdfjsModule = await import("pdfjs-dist");
    pdfjsModule.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
  }
  return pdfjsModule;
}

async function renderPdfToImages(file: File): Promise<string[]> {
  const pdfjs = await getPdfJs();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const results: string[] = [];
  for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 3); pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    canvas.width = viewport.width; canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
    results.push(canvas.toDataURL("image/png"));
  }
  return results;
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
  let line = ""; let offsetY = y;
  for (const char of text) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) { ctx.fillText(line, x, offsetY); line = char; offsetY += lineHeight; }
    else line = testLine;
  }
  if (line) ctx.fillText(line, x, offsetY);
}

Promise.all([loadDocs(), loadBoards(), loadMindMaps(), loadMermaidData()]).then(() => switchTab("markdown"));
