import DOMPurify from "dompurify";
import { marked } from "marked";
import mermaid from "mermaid";
import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("tools");

const markdownKey = "yusnote.creative.markdown";
const canvasKey = "yusnote.creative.canvas";
const flowKey = "yusnote.creative.flow";

const tabs = document.querySelectorAll<HTMLButtonElement>("[data-tab]");
const panels = document.querySelectorAll<HTMLElement>("[data-panel]");

function switchTab(target: string): void {
  tabs.forEach((button) => {
    button.dataset.active = button.dataset.tab === target ? "true" : "false";
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== target;
  });
  if (target === "flow") renderFlow();
}

tabs.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab ?? "note"));
});

const markdownInput = document.querySelector<HTMLTextAreaElement>("#markdownInput");
const markdownPreview = document.querySelector<HTMLElement>("#markdownPreview");

function renderMarkdown(): void {
  if (!markdownInput || !markdownPreview) return;
  markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(markdownInput.value) as string);
  window.localStorage.setItem(markdownKey, markdownInput.value);
}

if (markdownInput) {
  markdownInput.value = window.localStorage.getItem(markdownKey) ?? "# 今晚想记下的事\n\n- 调整首页排版\n- 继续整理收藏页";
  markdownInput.addEventListener("input", renderMarkdown);
  renderMarkdown();
}

document.querySelectorAll<HTMLButtonElement>("[data-md-action]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!markdownInput) return;
    const action = button.dataset.mdAction;
    const inserts: Record<string, string> = {
      h2: "\n## 小节标题\n",
      list: "\n- 第一项\n- 第二项\n",
      quote: "\n> 一句临时想法\n"
    };
    markdownInput.setRangeText(inserts[action ?? "quote"] ?? "", markdownInput.selectionStart, markdownInput.selectionEnd, "end");
    renderMarkdown();
    markdownInput.focus();
  });
});

document.querySelector<HTMLButtonElement>("#exportMarkdownButton")?.addEventListener("click", () => {
  if (!markdownInput) return;
  const blob = new Blob([markdownInput.value], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "creative-note.md";
  link.click();
  URL.revokeObjectURL(url);
});

const canvas = document.querySelector<HTMLCanvasElement>("#drawCanvas");
const colorInput = document.querySelector<HTMLInputElement>("#drawColor");
const sizeInput = document.querySelector<HTMLInputElement>("#drawSize");
let drawMode: "pen" | "eraser" = "pen";

if (canvas) {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    let drawing = false;

    const saved = window.localStorage.getItem(canvasKey);
    if (saved) {
      const image = new Image();
      image.src = saved;
      image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const pointFromEvent = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const source = "touches" in event ? event.touches[0] : event;
      return {
        x: (source.clientX - rect.left) * (canvas.width / rect.width),
        y: (source.clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const start = (event: MouseEvent | TouchEvent) => {
      drawing = true;
      const point = pointFromEvent(event);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    };

    const move = (event: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      const point = pointFromEvent(event);
      ctx.lineWidth = Number(sizeInput?.value ?? 6);
      ctx.lineCap = "round";
      ctx.strokeStyle = drawMode === "pen" ? colorInput?.value ?? "#c45d3f" : "#ffffff";
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    };

    const stop = () => {
      if (!drawing) return;
      drawing = false;
      window.localStorage.setItem(canvasKey, canvas.toDataURL("image/png"));
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start, { passive: true });
    canvas.addEventListener("touchmove", move, { passive: true });
    canvas.addEventListener("touchend", stop);

    document.querySelector<HTMLButtonElement>("#drawPenButton")?.addEventListener("click", () => {
      drawMode = "pen";
    });
    document.querySelector<HTMLButtonElement>("#drawEraserButton")?.addEventListener("click", () => {
      drawMode = "eraser";
    });
    document.querySelector<HTMLButtonElement>("#clearCanvasButton")?.addEventListener("click", () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      window.localStorage.setItem(canvasKey, canvas.toDataURL("image/png"));
    });
    document.querySelector<HTMLButtonElement>("#exportCanvasButton")?.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "creative-board.png";
      link.click();
    });
  }
}

mermaid.initialize({ startOnLoad: false, theme: "neutral" });
const flowInput = document.querySelector<HTMLTextAreaElement>("#flowInput");
const flowPreview = document.querySelector<HTMLElement>("#flowPreview");

function renderFlow(): void {
  if (!flowInput || !flowPreview) return;
  flowPreview.innerHTML = `<div class="mermaid">${flowInput.value}</div>`;
  try {
    mermaid.run({ nodes: [flowPreview.querySelector(".mermaid") as HTMLElement] });
    window.localStorage.setItem(flowKey, flowInput.value);
  } catch (error) {
    flowPreview.innerHTML = `<div class="empty-state">Mermaid 语法错误：${String(error)}</div>`;
  }
}

if (flowInput) {
  flowInput.value = window.localStorage.getItem(flowKey) ?? flowInput.value;
}

document.querySelector<HTMLButtonElement>("#loadFlowExampleButton")?.addEventListener("click", () => {
  if (!flowInput) return;
  flowInput.value = `graph TD
开始 --> 整理需求
整理灵感 --> 收束页面结构
收束页面结构 --> 做一轮预览检查
构建验证 --> 发布`;
  renderFlow();
});

document.querySelector<HTMLButtonElement>("#renderFlowButton")?.addEventListener("click", renderFlow);
document.querySelector<HTMLButtonElement>("#exportFlowButton")?.addEventListener("click", () => {
  const svg = flowPreview?.querySelector("svg");
  if (!svg) return;
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "flow.svg";
  link.click();
  URL.revokeObjectURL(url);
});

switchTab("note");
