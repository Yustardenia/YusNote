import type { IconId } from "./types";

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateTime(value?: string): string {
  if (!value) return "未设置";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  if (hours === 0) return `${remain} 分钟`;
  return `${hours} 小时 ${remain} 分钟`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function statusLabel(status: "planned" | "doing" | "done" | "skipped"): string {
  switch (status) {
    case "planned":
      return "准备中";
    case "doing":
      return "进行中";
    case "done":
      return "已完成";
    case "skipped":
      return "暂时搁置";
    default:
      return "未分类";
  }
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function guessQuickLinkIcon(url: string, label = ""): IconId {
  const lower = `${url} ${label}`.toLowerCase();
  if (lower.includes("github")) return "github";
  if (lower.includes("bilibili")) return "bilibili";
  if (lower.includes("youtube")) return "youtube";
  if (lower.includes("music") || lower.includes("spotify") || lower.includes("netease")) return "music";
  if (lower.includes("calendar")) return "calendar";
  if (lower.includes("game")) return "game";
  if (lower.includes("book") || lower.includes("read") || lower.includes("docs")) return "book";
  if (lower.includes("mail")) return "mail";
  return "link";
}

export function guessQuickLinkAccent(url: string, label = ""): string {
  const lower = `${url} ${label}`.toLowerCase();
  if (lower.includes("github")) return "night";
  if (lower.includes("bilibili")) return "sky";
  if (lower.includes("youtube")) return "rose";
  if (lower.includes("music")) return "mint";
  if (lower.includes("docs") || lower.includes("read")) return "gold";
  return "berry";
}
