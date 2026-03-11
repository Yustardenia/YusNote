import avatarAsset from "../assets/images/avatar-yus.svg";
import coverArcade from "../assets/images/cover-arcade.svg";
import coverGarden from "../assets/images/cover-garden.svg";
import coverLibrary from "../assets/images/cover-library.svg";
import coverShowcase from "../assets/images/cover-showcase.svg";
import instructionAsset from "../assets/images/instruction.png";
import wallpaperDay from "../assets/images/wallpaper-day.svg";
import wallpaperNight from "../assets/images/wallpaper-night.svg";
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
  headline: "把收藏、灵感和常用页面都收回夜色里。",
  subtitle: "Night Shelf",
  intro: "",
  status: "",
  currentMood: "",
  avatarAsset,
  wallpaperDay,
  wallpaperNight
};

export const statusPills: string[] = [];

export const collectionItems: CollectionItem[] = [
  {
    title: "🎨 夜航笔记",
    iconId: "brush",
    coverAsset: coverGarden,
    description: "灵感、草图和 Mermaid 片段都收在同一页，适合把一闪而过的念头按下。",
    href: "./tools/creative.html",
    tags: ["灵感", "草图", "创作"]
  },
  {
    title: "📚 收藏书架",
    iconId: "library",
    coverAsset: coverLibrary,
    description: "站内保留的教程、手记和作品说明都放在这里，像一本会继续长高的馆藏目录。",
    href: "./docs/index.html",
    tags: ["文档", "手记", "阅读"]
  },
  {
    title: "📡 指令",
    iconId: "instruction",
    coverAsset: instructionAsset,
    description: "左侧边栏吸附，右侧主屏解码，城市和食指会不断向你下达新指令。",
    href: "./docs/will-of-the-city.html",
    tags: ["指令", "广播", "装置"]
  },
  {
    title: "🎮 夜间游戏角",
    iconId: "game",
    coverAsset: coverArcade,
    description: "偶尔想从清单里抬头，就去小游戏角转一圈，顺手把最高分留在这里。",
    href: "./tools/game.html",
    tags: ["休息", "游戏", "轻松"]
  }
];

export const showcaseItems: ShowcaseItem[] = [
  {
    title: "📡 指令",
    iconId: "instruction",
    coverAsset: instructionAsset,
    description: "桌面端左侧吸附，移动端顶部折叠。每次点击都会解码一条新的怪诞指令。",
    href: "./docs/will-of-the-city.html",
    footer: "进入指令页"
  },
  {
    title: "📘 Yus 开发总览",
    iconId: "book",
    coverAsset: coverLibrary,
    description: "整理过的开发总览适合当作长期公开的索引页，方便回看结构和路线。",
    href: "./docs/guide.html",
    footer: "阅读手记"
  },
  {
    title: "🎧 Global Audio Notes",
    iconId: "audio",
    coverAsset: coverGarden,
    description: "音频系统文档和站点新加入的 BGM 设置互相照应，让页面更像完整的小站。",
    href: "./docs/audio-system.html",
    footer: "查看音频页"
  }
];

export const toolCards: LinkCard[] = [
  {
    href: "./tools/todo.html",
    kicker: "Notebook",
    title: "🗒️ Todo 清单",
    copy: "把今天想做的事写进书页边角，完成、恢复和倒计时都留在同一页里。",
    footer: "写进清单",
    iconId: "bookmark",
    coverAsset: coverGarden,
    tags: ["待办", "整理"]
  },
  {
    href: "./tools/schedule.html",
    kicker: "Routine",
    title: "🗓️ 时间安排",
    copy: "用更柔和的方式整理一天节奏，把重要时间块摆在最前面。",
    footer: "查看日程",
    iconId: "calendar",
    coverAsset: coverLibrary,
    tags: ["节奏", "规划"]
  },
  {
    href: "./tools/kanban.html",
    kicker: "Flow",
    title: "📋 看板",
    copy: "让任务在 backlog、doing 和 done 之间慢慢流动，别把事情都堆在脑海里。",
    footer: "整理流转",
    iconId: "board",
    coverAsset: coverShowcase,
    tags: ["拖拽", "任务"]
  },
  {
    href: "./tools/focus.html",
    kicker: "Focus",
    title: "⏱️ Pomodoro",
    copy: "保持轻量的专注计时与记录，把提醒音和页面 BGM 放进同一套偏好里。",
    footer: "开始专注",
    iconId: "clock",
    coverAsset: coverArcade,
    tags: ["专注", "番茄钟"]
  },
  {
    href: "./tools/creative.html",
    kicker: "Studio",
    title: "🎨 Creative Studio",
    copy: "Markdown、白板和流程图继续保留，只是换成更像个人工作角的样子。",
    footer: "打开创作页",
    iconId: "brush",
    coverAsset: coverGarden,
    tags: ["创作", "白板"]
  },
  {
    href: "./tools/compare.html",
    kicker: "Files",
    title: "🧾 目录比对",
    copy: "在浏览器里看清哪些文件重复，决定要不要删除之前先做一次温和确认。",
    footer: "比较目录",
    iconId: "compare",
    coverAsset: coverLibrary,
    tags: ["文件", "整理"]
  },
  {
    href: "./tools/rename.html",
    kicker: "Batch",
    title: "✏️ 批量重命名",
    copy: "改名、预览和导出都在本地完成，适合整理素材、截图和书签备份。",
    footer: "开始整理",
    iconId: "rename",
    coverAsset: coverShowcase,
    tags: ["重命名", "导出"]
  },
  {
    href: "./tools/keyword.html",
    kicker: "Cards",
    title: "🏷️ 关键词卡片",
    copy: "输入名字就生成一张适合截图的小卡片，留一点轻松的小仪式感。",
    footer: "生成卡片",
    iconId: "keyword",
    coverAsset: coverGarden,
    tags: ["互动", "分享"]
  },
  {
    href: "./tools/divination.html",
    kicker: "Fortune",
    title: "🪙 投币占卜",
    copy: "把有点犹豫的时刻变成一个轻量小游戏，给自己一点可爱的提示。",
    footer: "掷一卦",
    iconId: "divination",
    coverAsset: coverLibrary,
    tags: ["趣味", "仪式感"]
  },
  {
    href: "./tools/game.html",
    kicker: "Arcade",
    title: "🎮 Cyber Dash",
    copy: "偶尔从任务里抬头，去小游戏角逛一圈，给页面留一点呼吸和霓虹。",
    footer: "进入游戏",
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
    copy: "把零散的开发说明重新梳理成一份容易回看的总览页，适合慢慢翻。",
    footer: "阅读总览",
    iconId: "book",
    coverAsset: coverLibrary,
    tags: ["总览", "开发"]
  },
  {
    href: "./docs/unity-ui.html",
    kicker: "UI",
    title: "🧩 Unity UI 体系",
    copy: "聚焦 UI 结构、页面职责和绑定方式，让文档更像可靠的设计笔记。",
    footer: "查看 UI 页",
    iconId: "grid",
    coverAsset: coverGarden,
    tags: ["界面", "结构"]
  },
  {
    href: "./docs/audio-system.html",
    kicker: "Audio",
    title: "🎧 全局音频系统",
    copy: "梳理 BGM、音效和总线策略，也和站点这次重新加入的音频体验互相照应。",
    footer: "阅读音频页",
    iconId: "audio",
    coverAsset: coverShowcase,
    tags: ["音频", "系统"]
  },
  {
    href: "./docs/will-of-the-city.html",
    kicker: "Instruction",
    title: "📡 指令",
    copy: "把展示页改成可生成、可停留、可重复刷新的城市指令侧栏。",
    footer: "进入指令页",
    iconId: "instruction",
    coverAsset: instructionAsset,
    tags: ["指令", "项目"]
  }
];

export const audioTracks: AudioTrack[] = [
  {
    id: "moonlit-notes",
    title: "Moonlit Notes",
    copy: "偏安静的夜色合成器，适合翻页和写字。",
    src: trackMoonlit
  },
  {
    id: "pixel-bloom",
    title: "Pixel Bloom",
    copy: "更轻快一点的节奏，适合切换到整理模式。",
    src: trackPixelBloom
  }
];

export const effectTracks = {
  click: effectClick,
  focusComplete: effectComplete
} as const;
