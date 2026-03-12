import type {
  AudioPreference,
  CountdownState,
  CreativeBoardProject,
  CreativeDoc,
  FocusState,
  KanbanBoard,
  MermaidSnippet,
  MindMapProject,
  QuickLink,
  ScheduleItem,
  ThemePreference,
  TodoItem
} from "./types";
import { guessQuickLinkAccent, guessQuickLinkIcon, todayIso, uid } from "./utils";

const keys = {
  theme: "yusnote.theme",
  quickLinks: "yusnote.quick-links",
  todos: "yusnote.todos",
  schedule: "yusnote.schedule",
  kanban: "yusnote.kanban",
  countdown: "yusnote.countdown",
  focus: "yusnote.focus",
  audio: "yusnote.audio"
} as const;

const creativeDbName = "yusnote-creative";
const creativeDbVersion = 1;
const creativeStores = {
  docs: "docs",
  boards: "boards",
  mindmaps: "mindmaps",
  mermaids: "mermaids"
} as const;

const defaultQuickLinks: QuickLink[] = [
  {
    id: uid("link"),
    label: "GitHub",
    url: "https://github.com/Yustardenia",
    iconId: "github",
    accent: "night"
  },
  {
    id: uid("link"),
    label: "Bilibili",
    url: "https://www.bilibili.com",
    iconId: "bilibili",
    accent: "sky"
  },
  {
    id: uid("link"),
    label: "YouTube",
    url: "https://www.youtube.com",
    iconId: "youtube",
    accent: "rose"
  }
];

const defaultCountdown: CountdownState = {
  id: uid("countdown"),
  title: "下次见面",
  targetAt: `${todayIso()}T22:00`
};

const defaultKanban: KanbanBoard = {
  backlog: [{ id: uid("task"), text: "整理今天最想推进的一件事", note: "", updatedAt: new Date().toISOString() }],
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

const defaultAudioPreference: AudioPreference = {
  trackId: "moonlit-notes",
  volume: 0.55,
  muted: false,
  effectsEnabled: true,
  activated: false,
  collapsed: true
};

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
  const links = readJson<any[]>(keys.quickLinks, defaultQuickLinks);
  return links.map((entry) => ({
    id: typeof entry.id === "string" ? entry.id : uid("link"),
    label: typeof entry.label === "string" ? entry.label : "未命名链接",
    url: typeof entry.url === "string" ? entry.url : "https://example.com",
    iconId:
      typeof entry.iconId === "string"
        ? entry.iconId
        : guessQuickLinkIcon(String(entry.url ?? ""), String(entry.label ?? "")),
    emojiFallback: typeof entry.icon === "string" ? entry.icon : entry.emojiFallback,
    accent:
      typeof entry.accent === "string"
        ? entry.accent
        : guessQuickLinkAccent(String(entry.url ?? ""), String(entry.label ?? ""))
  }));
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

export function getAudioPreference(): AudioPreference {
  const saved = readJson<AudioPreference>(keys.audio, defaultAudioPreference);
  return {
    ...defaultAudioPreference,
    ...saved
  };
}

export function saveAudioPreference(state: AudioPreference): void {
  writeJson(keys.audio, state);
}

let creativeDbPromise: Promise<IDBDatabase> | null = null;

function openCreativeDb(): Promise<IDBDatabase> {
  if (creativeDbPromise) return creativeDbPromise;

  creativeDbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(creativeDbName, creativeDbVersion);

    request.onupgradeneeded = () => {
      const db = request.result;
      Object.values(creativeStores).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open creative database."));
  });

  return creativeDbPromise;
}

async function getStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const db = await openCreativeDb();
  return db.transaction(storeName, mode).objectStore(storeName);
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

async function listRecords<T>(storeName: string): Promise<T[]> {
  const store = await getStore(storeName, "readonly");
  const result = await requestToPromise(store.getAll());
  return (result as T[]).sort((a: any, b: any) => String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? "")));
}

async function saveRecord<T extends { id: string }>(storeName: string, value: T): Promise<T> {
  const store = await getStore(storeName, "readwrite");
  await requestToPromise(store.put(value));
  return value;
}

async function deleteRecord(storeName: string, id: string): Promise<void> {
  const store = await getStore(storeName, "readwrite");
  await requestToPromise(store.delete(id));
}

async function getRecord<T>(storeName: string, id: string): Promise<T | undefined> {
  const store = await getStore(storeName, "readonly");
  return (await requestToPromise(store.get(id))) as T | undefined;
}

export function listCreativeDocs(): Promise<CreativeDoc[]> {
  return listRecords<CreativeDoc>(creativeStores.docs);
}

export function saveCreativeDoc(doc: CreativeDoc): Promise<CreativeDoc> {
  return saveRecord(creativeStores.docs, doc);
}

export function getCreativeDoc(id: string): Promise<CreativeDoc | undefined> {
  return getRecord<CreativeDoc>(creativeStores.docs, id);
}

export function deleteCreativeDoc(id: string): Promise<void> {
  return deleteRecord(creativeStores.docs, id);
}

export function listBoardProjects(): Promise<CreativeBoardProject[]> {
  return listRecords<CreativeBoardProject>(creativeStores.boards);
}

export function saveBoardProject(project: CreativeBoardProject): Promise<CreativeBoardProject> {
  return saveRecord(creativeStores.boards, project);
}

export function getBoardProject(id: string): Promise<CreativeBoardProject | undefined> {
  return getRecord<CreativeBoardProject>(creativeStores.boards, id);
}

export function deleteBoardProject(id: string): Promise<void> {
  return deleteRecord(creativeStores.boards, id);
}

export function listMindMapProjects(): Promise<MindMapProject[]> {
  return listRecords<MindMapProject>(creativeStores.mindmaps);
}

export function saveMindMapProject(project: MindMapProject): Promise<MindMapProject> {
  return saveRecord(creativeStores.mindmaps, project);
}

export function getMindMapProject(id: string): Promise<MindMapProject | undefined> {
  return getRecord<MindMapProject>(creativeStores.mindmaps, id);
}

export function deleteMindMapProject(id: string): Promise<void> {
  return deleteRecord(creativeStores.mindmaps, id);
}

export function listMermaidSnippets(): Promise<MermaidSnippet[]> {
  return listRecords<MermaidSnippet>(creativeStores.mermaids);
}

export function saveMermaidSnippet(snippet: MermaidSnippet): Promise<MermaidSnippet> {
  return saveRecord(creativeStores.mermaids, snippet);
}

export function getMermaidSnippet(id: string): Promise<MermaidSnippet | undefined> {
  return getRecord<MermaidSnippet>(creativeStores.mermaids, id);
}

export function deleteMermaidSnippet(id: string): Promise<void> {
  return deleteRecord(creativeStores.mermaids, id);
}
