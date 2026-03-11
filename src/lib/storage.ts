import type {
  CountdownState,
  FocusState,
  KanbanBoard,
  QuickLink,
  ScheduleItem,
  ThemePreference,
  TodoItem
} from "./types";
import { todayIso, uid } from "./utils";

const keys = {
  theme: "yusnote.theme",
  quickLinks: "yusnote.quick-links",
  todos: "yusnote.todos",
  schedule: "yusnote.schedule",
  kanban: "yusnote.kanban",
  countdown: "yusnote.countdown",
  focus: "yusnote.focus"
} as const;

const defaultQuickLinks: QuickLink[] = [
  { id: uid("link"), label: "GitHub", url: "https://github.com", icon: "↗", accent: "sunset" },
  { id: uid("link"), label: "Bilibili", url: "https://www.bilibili.com", icon: "▣", accent: "sea" },
  { id: uid("link"), label: "YouTube", url: "https://www.youtube.com", icon: "▶", accent: "ember" }
];

const defaultCountdown: CountdownState = {
  id: uid("countdown"),
  title: "下一次冲刺",
  targetAt: `${todayIso()}T22:00`
};

const defaultKanban: KanbanBoard = {
  backlog: [
    { id: uid("task"), text: "整理今天的优先级", note: "", updatedAt: new Date().toISOString() }
  ],
  doing: [],
  done: []
};

const defaultFocus = (): FocusState => ({
  today: todayIso(),
  presetMinutes: 25,
  volume: 0.65,
  autoStartBreak: false,
  completedCount: 0,
  totalMinutes: 0,
  sessions: []
});

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getTheme(): ThemePreference {
  const theme = window.localStorage.getItem(keys.theme);
  return theme === "night" ? "night" : "day";
}

export function setTheme(theme: ThemePreference): void {
  window.localStorage.setItem(keys.theme, theme);
}

export function getQuickLinks(): QuickLink[] {
  return readJson(keys.quickLinks, defaultQuickLinks);
}

export function saveQuickLinks(links: QuickLink[]): void {
  writeJson(keys.quickLinks, links);
}

export function getTodos(): TodoItem[] {
  return readJson(keys.todos, []);
}

export function saveTodos(items: TodoItem[]): void {
  writeJson(keys.todos, items);
}

export function getSchedule(): ScheduleItem[] {
  return readJson(keys.schedule, []);
}

export function saveSchedule(items: ScheduleItem[]): void {
  writeJson(keys.schedule, items);
}

export function getKanban(): KanbanBoard {
  return readJson(keys.kanban, defaultKanban);
}

export function saveKanban(board: KanbanBoard): void {
  writeJson(keys.kanban, board);
}

export function getCountdown(): CountdownState {
  return readJson(keys.countdown, defaultCountdown);
}

export function saveCountdown(state: CountdownState): void {
  writeJson(keys.countdown, state);
}

export function getFocusState(): FocusState {
  const saved = readJson<FocusState>(keys.focus, defaultFocus());
  if (saved.today !== todayIso()) {
    return {
      ...defaultFocus(),
      presetMinutes: saved.presetMinutes,
      volume: saved.volume,
      autoStartBreak: saved.autoStartBreak
    };
  }
  return saved;
}

export function saveFocusState(state: FocusState): void {
  writeJson(keys.focus, state);
}
