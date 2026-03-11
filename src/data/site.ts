import avatarAsset from "../assets/images/avatar-yus.svg";
import coverArcade from "../assets/images/cover-arcade.svg";
import coverGarden from "../assets/images/cover-garden.svg";
import coverLibrary from "../assets/images/cover-library.svg";
import coverShowcase from "../assets/images/cover-showcase.svg";
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
  subtitle: "收藏、灵感与工具都住在同一片夜色里。",
  intro:
    "这里保留我常用的小工具、项目手记和一些想长期展示的页面。它更像一间会亮灯的个人房间，而不是纯粹的工具面板。",
  status: "最近在整理站点气质、补作品入口，也顺手把背景音乐和图标重新接回来。",
  currentMood: "夜风 / 书页 / 合成器",
  avatarAsset,
  wallpaperDay,
  wallpaperNight
};

export const statusPills = ["二次元个人站", "收藏橱窗", "可替换背景图", "手动 BGM", "本地保存"];

export const collectionItems: CollectionItem[] = [
  {
    title: "夜航笔记",
    iconId: "brush",
    coverAsset: coverGarden,
    description: "把零碎灵感、涂鸦和 Mermaid 草图都收进同一页，适合随手记下一点突如其来的想法。",
    href: "./tools/creative.html",
    tags: ["灵感", "草稿", "创作"]
  },
  {
    title: "收藏书架",
    iconId: "library",
    coverAsset: coverLibrary,
    description: "站内保留的教程、手记和作品说明都摆在这里，像翻一本慢慢积累起来的手账。",
    href: "./docs/index.html",
    tags: ["文档", "手记", "阅读"]
  },
  {
    title: "作品橱窗",
    iconId: "showcase",
    coverAsset: coverShowcase,
    description: "把想长期展示的页面单独摆出来，让项目气质和文本都能慢慢停留一会儿。",
    href: "./docs/will-of-the-city.html",
    tags: ["展示", "视觉", "项目"]
  },
  {
    title: "夜间游戏角",
    iconId: "game",
    coverAsset: coverArcade,
    description: "偶尔想从清单里抬头，就去小小的游乐区松一下，顺便把最高分留在这里。",
    href: "./tools/game.html",
    tags: ["休息", "游戏", "轻松"]
  }
];

export const showcaseItems: ShowcaseItem[] = [
  {
    title: "Will of the City",
    iconId: "showcase",
    coverAsset: coverShowcase,
    description: "作为站内的展示页样本，保留一份较完整的项目气质说明。",
    href: "./docs/will-of-the-city.html",
    footer: "进入展示页"
  },
  {
    title: "Yus 开发总览",
    iconId: "book",
    coverAsset: coverLibrary,
    description: "整理过的开发总览更适合当作长期公开的索引页，方便回看结构和路线。",
    href: "./docs/guide.html",
    footer: "阅读手记"
  },
  {
    title: "Global Audio Notes",
    iconId: "audio",
    coverAsset: coverGarden,
    description: "音频系统文档和站点新加入的 BGM 设定呼应起来，让页面更像一个完整的小站。",
    href: "./docs/audio-system.html",
    footer: "查看音频页"
  }
];

export const toolCards: LinkCard[] = [
  {
    href: "./tools/todo.html",
    kicker: "Notebook",
    title: "Todo 清单",
    copy: "把今天想做的事写进书页边角，完成、恢复和倒计时都留在同一页里。",
    footer: "写进清单",
    iconId: "bookmark",
    coverAsset: coverGarden,
    tags: ["待办", "整理"]
  },
  {
    href: "./tools/schedule.html",
    kicker: "Routine",
    title: "时间安排",
    copy: "用更柔和的方式整理一天的节奏，把重要的时间块摆在最前面。",
    footer: "查看日程",
    iconId: "calendar",
    coverAsset: coverLibrary,
    tags: ["节奏", "规划"]
  },
  {
    href: "./tools/kanban.html",
    kicker: "Flow",
    title: "看板",
    copy: "让任务在 backlog、doing 和 done 之间慢慢流动，别把事情都堆在脑海里。",
    footer: "整理流转",
    iconId: "board",
    coverAsset: coverShowcase,
    tags: ["拖拽", "任务"]
  },
  {
    href: "./tools/focus.html",
    kicker: "Focus",
    title: "Pomodoro",
    copy: "保持轻量的专注计时与记录，把提醒音和页面 BGM 放进同一套偏好里。",
    footer: "开始专注",
    iconId: "clock",
    coverAsset: coverArcade,
    tags: ["专注", "番茄钟"]
  },
  {
    href: "./tools/creative.html",
    kicker: "Studio",
    title: "Creative Studio",
    copy: "Markdown、白板和流程图继续保留，只是换成更像个人工作角的样子。",
    footer: "打开创作页",
    iconId: "brush",
    coverAsset: coverGarden,
    tags: ["创作", "白板"]
  },
  {
    href: "./tools/compare.html",
    kicker: "Files",
    title: "目录比对",
    copy: "在浏览器里看清楚哪些文件重复，决定要不要删除之前先做一次温柔的确认。",
    footer: "比较目录",
    iconId: "compare",
    coverAsset: coverLibrary,
    tags: ["文件", "整理"]
  },
  {
    href: "./tools/rename.html",
    kicker: "Batch",
    title: "批量重命名",
    copy: "改名、预览和导出都在本地完成，适合整理素材、截图和书签备份。",
    footer: "开始整理",
    iconId: "rename",
    coverAsset: coverShowcase,
    tags: ["重命名", "导出"]
  },
  {
    href: "./tools/keyword.html",
    kicker: "Cards",
    title: "关键词卡片",
    copy: "输入名字就生成一张适合截图的小卡片，留一点轻松的小仪式感。",
    footer: "生成卡片",
    iconId: "keyword",
    coverAsset: coverGarden,
    tags: ["互动", "分享"]
  },
  {
    href: "./tools/divination.html",
    kicker: "Fortune",
    title: "投币占卜",
    copy: "把有点犹豫的时刻变成一个轻量的小游戏，给自己一点可爱的提示。",
    footer: "掷一卦",
    iconId: "divination",
    coverAsset: coverLibrary,
    tags: ["趣味", "仪式感"]
  },
  {
    href: "./tools/game.html",
    kicker: "Arcade",
    title: "Cyber Dash",
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
    title: "Yus 开发总览",
    copy: "把零散的开发说明重新梳理成一份容易回看的总览页，适合慢慢翻。",
    footer: "阅读总览",
    iconId: "book",
    coverAsset: coverLibrary,
    tags: ["总览", "开发"]
  },
  {
    href: "./docs/unity-ui.html",
    kicker: "UI",
    title: "Unity UI 体系",
    copy: "聚焦 UI 结构、页面职责和绑定方式，让文档更像可靠的设计笔记。",
    footer: "查看 UI 页",
    iconId: "grid",
    coverAsset: coverGarden,
    tags: ["界面", "结构"]
  },
  {
    href: "./docs/audio-system.html",
    kicker: "Audio",
    title: "全局音频系统",
    copy: "梳理 BGM、音效和总线策略，也和站点这次重新加入的音频体验互相照应。",
    footer: "阅读音频页",
    iconId: "audio",
    coverAsset: coverShowcase,
    tags: ["音频", "系统"]
  },
  {
    href: "./docs/will-of-the-city.html",
    kicker: "Showcase",
    title: "Will of the City",
    copy: "保留一张更完整的作品展示页，把文字和氛围一起慢慢放出来。",
    footer: "进入展示页",
    iconId: "showcase",
    coverAsset: coverArcade,
    tags: ["展示", "项目"]
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
