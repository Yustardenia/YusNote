export type ThemePreference = "day" | "night";

export type SearchEngine = "bing" | "bilibili" | "pixiv";

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
  | "link"
  | "search"
  | "markdown"
  | "image"
  | "pdf"
  | "download"
  | "upload"
  | "trash"
  | "duplicate"
  | "mindmap"
  | "layers"
  | "shape"
  | "type"
  | "note"
  | "wand";

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
  collapsed: boolean;
}

export interface CreativeDoc {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type BoardTool =
  | "select"
  | "pen"
  | "highlighter"
  | "eraser"
  | "line"
  | "rect"
  | "ellipse"
  | "arrow"
  | "text"
  | "note";

export interface BoardStrokePoint {
  x: number;
  y: number;
}

export interface BoardBaseElement {
  id: string;
  type: "stroke" | "shape" | "text" | "asset" | "note";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation?: number;
  createdAt: string;
}

export interface BoardStrokeElement extends BoardBaseElement {
  type: "stroke";
  tool: "pen" | "highlighter" | "eraser";
  size: number;
  points: BoardStrokePoint[];
}

export interface BoardShapeElement extends BoardBaseElement {
  type: "shape";
  shape: "line" | "rect" | "ellipse" | "arrow";
  strokeWidth: number;
  fill?: string;
}

export interface BoardTextElement extends BoardBaseElement {
  type: "text" | "note";
  text: string;
  fontSize: number;
  background?: string;
}

export type BoardAssetType = "image" | "pdf-page" | "markdown-card";

export interface BoardAssetElement extends BoardBaseElement {
  type: "asset";
  assetType: BoardAssetType;
  src?: string;
  label?: string;
  page?: number;
  payload?: string;
}

export type BoardElement =
  | BoardStrokeElement
  | BoardShapeElement
  | BoardTextElement
  | BoardAssetElement;

export interface CreativeBoardPage {
  id: string;
  name: string;
  elements: BoardElement[];
}

export interface CreativeBoardProject {
  id: string;
  name: string;
  pages: CreativeBoardPage[];
  activePageId: string;
  updatedAt: string;
}

export interface MindMapNode {
  id: string;
  text: string;
  color: string;
  collapsed: boolean;
  x: number;
  y: number;
  children: MindMapNode[];
}

export interface MindMapProject {
  id: string;
  name: string;
  rootNode: MindMapNode;
  updatedAt: string;
}

export type MermaidTemplateKind =
  | "flowchart"
  | "sequence"
  | "gantt"
  | "state"
  | "class"
  | "er"
  | "journey"
  | "mindmap";

export interface MermaidSnippet {
  id: string;
  name: string;
  code: string;
  templateKind: MermaidTemplateKind;
  updatedAt: string;
}
