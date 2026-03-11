export type ThemePreference = "day" | "night";

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  accent: string;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
  dueAt?: string;
}

export interface KanbanTask {
  id: string;
  text: string;
  note: string;
  dueAt?: string;
  updatedAt: string;
}

export interface KanbanBoard {
  backlog: KanbanTask[];
  doing: KanbanTask[];
  done: KanbanTask[];
}

export type ScheduleStatus = "planned" | "doing" | "done" | "skipped";

export interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  status: ScheduleStatus;
  note: string;
}

export interface CountdownState {
  id: string;
  title: string;
  targetAt: string;
  linkedTaskId?: string;
}

export interface FocusSession {
  id: string;
  finishedAt: string;
  minutes: number;
  mode: "focus" | "rest";
}

export interface FocusState {
  today: string;
  presetMinutes: number;
  volume: number;
  autoStartBreak: boolean;
  completedCount: number;
  totalMinutes: number;
  sessions: FocusSession[];
}
