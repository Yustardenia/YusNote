export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function todayIso(): string {
  return new Date().toISOString().split("T")[0] ?? "";
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
      return "还没开始";
    case "doing":
      return "正在进行";
    case "done":
      return "已经完成";
    case "skipped":
      return "今天算了";
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
