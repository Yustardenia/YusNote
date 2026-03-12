import avatarAsset from "../assets/images/avatar-yus.svg";
import coverArcade from "../assets/images/cover-arcade.svg";
import coverGarden from "../assets/images/cover-garden.svg";
import coverLibrary from "../assets/images/cover-library.svg";
import coverShowcase from "../assets/images/cover-showcase.svg";
import instructionAsset from "../assets/images/instruction.png";
import wallpaperDay from "../assets/images/wallpaper-day-anime.jpg";
import wallpaperNight from "../assets/images/wallpaper-night-anime.png";
import trackMoonlit from "../assets/audio/moonlit-notes.wav";
import trackPixelBloom from "../assets/audio/pixel-bloom.wav";
import effectClick from "../assets/audio/click-soft.wav";
import effectComplete from "../assets/audio/focus-bell.wav";
import type {
  AudioTrack,
  CollectionItem,
  IconId,
  ShowcaseItem,
  SiteProfile
} from "../lib/types";

export interface LinkCard {
  href: string;
  kicker: string;
  title: string;
  copy: string;
  footer: string;
  iconId: IconId;
  coverAsset: string;
  tags: string[];
}

export const siteProfile: SiteProfile = {
  name: "YusNote",
  headline: "夜色书架",
  subtitle: "Moonlit Shelf",
  intro: "",
  status: "",
  currentMood: "",
  avatarAsset,
  wallpaperDay,
  wallpaperNight
};

export const statusPills: string[] = ["🌙 夜航", "📡 指令", "🎧 BGM"];

export const collectionItems: CollectionItem[] = [
  {
    title: "🎨 夜航笔记",
    iconId: "brush",
    coverAsset: coverGarden,
    description: "",
    href: "./tools/creative.html",
    tags: ["灵感", "草图", "创作"]
  },
  {
    title: "📚 收藏书架",
    iconId: "library",
    coverAsset: coverLibrary,
    description: "",
    href: "./docs/index.html",
    tags: ["文档", "手记", "阅读"]
  },
  {
    title: "📡 指令",
    iconId: "instruction",
    coverAsset: instructionAsset,
    description: "",
    href: "./docs/will-of-the-city.html",
    tags: ["指令", "广播", "装置"]
  },
  {
    title: "🎮 夜间游戏角",
    iconId: "game",
    coverAsset: coverArcade,
    description: "",
    href: "./tools/game.html",
    tags: ["休息", "游戏", "轻松"]
  }
];

export const showcaseItems: ShowcaseItem[] = [
  {
    title: "📡 指令",
    iconId: "instruction",
    coverAsset: instructionAsset,
    description: "",
    href: "./docs/will-of-the-city.html",
    footer: "打开"
  },
  {
    title: "📘 Yus 开发总览",
    iconId: "book",
    coverAsset: coverLibrary,
    description: "",
    href: "./docs/guide.html",
    footer: "打开"
  },
  {
    title: "🎧 Global Audio Notes",
    iconId: "audio",
    coverAsset: coverGarden,
    description: "",
    href: "./docs/audio-system.html",
    footer: "打开"
  }
];

export const toolCards: LinkCard[] = [
  {
    href: "./tools/todo.html",
    kicker: "Notebook",
    title: "🗒️ Todo 清单",
    copy: "",
    footer: "进入",
    iconId: "bookmark",
    coverAsset: coverGarden,
    tags: ["待办", "整理"]
  },
  {
    href: "./tools/schedule.html",
    kicker: "Routine",
    title: "🗓️ 时间安排",
    copy: "",
    footer: "进入",
    iconId: "calendar",
    coverAsset: coverLibrary,
    tags: ["节奏", "规划"]
  },
  {
    href: "./tools/kanban.html",
    kicker: "Flow",
    title: "📋 看板",
    copy: "",
    footer: "进入",
    iconId: "board",
    coverAsset: coverShowcase,
    tags: ["拖拽", "任务"]
  },
  {
    href: "./tools/focus.html",
    kicker: "Focus",
    title: "⏱️ Pomodoro",
    copy: "",
    footer: "进入",
    iconId: "clock",
    coverAsset: coverArcade,
    tags: ["专注", "番茄钟"]
  },
  {
    href: "./tools/creative.html",
    kicker: "Studio",
    title: "🎨 Creative Studio",
    copy: "",
    footer: "进入",
    iconId: "brush",
    coverAsset: coverGarden,
    tags: ["创作", "白板"]
  },
  {
    href: "./tools/compare.html",
    kicker: "Files",
    title: "🧾 目录比对",
    copy: "",
    footer: "进入",
    iconId: "compare",
    coverAsset: coverLibrary,
    tags: ["文件", "整理"]
  },
  {
    href: "./tools/rename.html",
    kicker: "Batch",
    title: "✏️ 批量重命名",
    copy: "",
    footer: "进入",
    iconId: "rename",
    coverAsset: coverShowcase,
    tags: ["重命名", "导出"]
  },
  {
    href: "./tools/keyword.html",
    kicker: "Cards",
    title: "🏷️ 关键词卡片",
    copy: "",
    footer: "进入",
    iconId: "keyword",
    coverAsset: coverGarden,
    tags: ["互动", "分享"]
  },
  {
    href: "./tools/divination.html",
    kicker: "Fortune",
    title: "🪙 投币占卜",
    copy: "",
    footer: "进入",
    iconId: "divination",
    coverAsset: coverLibrary,
    tags: ["趣味", "仪式感"]
  },
  {
    href: "./tools/game.html",
    kicker: "Arcade",
    title: "🎮 Cyber Dash",
    copy: "",
    footer: "进入",
    iconId: "game",
    coverAsset: coverArcade,
    tags: ["放松", "游玩"]
  }
];

export const docCards: LinkCard[] = [
  {
    href: "./docs/guide.html",
    kicker: "Guide",
    title: "📘 Yus 开发总览",
    copy: "",
    footer: "打开",
    iconId: "book",
    coverAsset: coverLibrary,
    tags: ["总览", "开发"]
  },
  {
    href: "./docs/unity-ui.html",
    kicker: "UI",
    title: "🧩 Unity UI 体系",
    copy: "",
    footer: "打开",
    iconId: "grid",
    coverAsset: coverGarden,
    tags: ["界面", "结构"]
  },
  {
    href: "./docs/audio-system.html",
    kicker: "Audio",
    title: "🎧 全局音频系统",
    copy: "",
    footer: "打开",
    iconId: "audio",
    coverAsset: coverShowcase,
    tags: ["音频", "系统"]
  },
  {
    href: "./docs/will-of-the-city.html",
    kicker: "Instruction",
    title: "📡 指令",
    copy: "",
    footer: "打开",
    iconId: "instruction",
    coverAsset: instructionAsset,
    tags: ["指令", "项目"]
  }
];

export const audioTracks: AudioTrack[] = [
  {
    id: "moonlit-notes",
    title: "Moonlit Notes",
    copy: "",
    src: trackMoonlit
  },
  {
    id: "pixel-bloom",
    title: "Pixel Bloom",
    copy: "",
    src: trackPixelBloom
  }
];

export const effectTracks = {
  click: effectClick,
  focusComplete: effectComplete
} as const;
