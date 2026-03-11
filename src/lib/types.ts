export type ThemePreference = "day" | "night";

export type IconId =
  | "home"
  | "sparkle"
  | "bookmark"
  | "book"
  | "music"
  | "moon"
  | "sun"
  | "play"
  | "pause"
  | "next"
  | "mute"
  | "volume"
  | "grid"
  | "calendar"
  | "board"
  | "clock"
  | "brush"
  | "compare"
  | "rename"
  | "keyword"
  | "divination"
  | "game"
  | "github"
  | "bilibili"
  | "youtube"
  | "video"
  | "star"
  | "library"
  | "controller"
  | "audio"
  | "showcase"
  | "instruction"
  | "archive"
  | "alert"
  | "heart"
  | "flower"
  | "mail"
  | "link";

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  iconId: IconId;
  emojiFallback?: string;
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

export interface SiteProfile {
  name: string;
  headline: string;
  subtitle: string;
  intro: string;
  status: string;
  currentMood: string;
  avatarAsset: string;
  wallpaperDay: string;
  wallpaperNight: string;
}

export interface CollectionItem {
  title: string;
  iconId: IconId;
  coverAsset: string;
  description: string;
  href: string;
  tags: string[];
}

export interface ShowcaseItem {
  title: string;
  iconId: IconId;
  coverAsset: string;
  description: string;
  href: string;
  footer: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  copy: string;
  src: string;
}

export interface AudioPreference {
  trackId: string;
  volume: number;
  muted: boolean;
  effectsEnabled: boolean;
  activated: boolean;
}
