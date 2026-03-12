import avatarAsset from "../assets/images/avatar-yus.svg";
import wallpaperDay from "../assets/images/wallpaper-day-anime.jpg";
import wallpaperNight from "../assets/images/wallpaper-night-anime.png";
import trackMoonlit from "../assets/audio/moonlit-notes.wav";
import trackPixelBloom from "../assets/audio/pixel-bloom.wav";
import effectClick from "../assets/audio/click-soft.wav";
import effectComplete from "../assets/audio/focus-bell.wav";
import type { AudioTrack, IconId, SearchEngine, SiteProfile } from "../lib/types";

export interface HomeSidebarLink {
  href: string;
  label: string;
  iconId: IconId;
  external?: boolean;
}

export interface HomeShowcase {
  title: string;
}

export interface ToolCard {
  href: string;
  title: string;
  iconId: IconId;
}

export interface SearchEngineOption {
  value: SearchEngine;
  label: string;
}

export const siteProfile: SiteProfile = {
  name: "YusNote",
  headline: "夜航橱窗",
  subtitle: "Moonlit Window",
  intro: "",
  status: "",
  currentMood: "",
  avatarAsset,
  wallpaperDay,
  wallpaperNight
};

export const homeSidebarLinks: HomeSidebarLink[] = [
  { href: "./index.html", label: "首页", iconId: "home" },
  { href: "./tools/todo.html", label: "Todo", iconId: "bookmark" },
  { href: "./tools/schedule.html", label: "日程", iconId: "calendar" },
  { href: "./tools/focus.html", label: "专注", iconId: "clock" },
  { href: "./tools/creative.html", label: "Creative", iconId: "brush" }
];

export const homeShowcase: HomeShowcase = {
  title: "Yustardenia's Site"
};

export const toolCards: ToolCard[] = [
  { href: "./index.html", title: "首页", iconId: "home" },
  { href: "./tools/todo.html", title: "Todo", iconId: "bookmark" },
  { href: "./tools/schedule.html", title: "日程", iconId: "calendar" },
  { href: "./tools/focus.html", title: "专注", iconId: "clock" },
  { href: "./tools/creative.html", title: "创作", iconId: "brush" },
  { href: "./tools/compare.html", title: "对比", iconId: "compare" },
  { href: "./tools/rename.html", title: "重命名", iconId: "rename" },
  { href: "./tools/keyword.html", title: "关键词", iconId: "keyword" },
  { href: "./tools/divination.html", title: "占卜", iconId: "divination" },
  { href: "./tools/game.html", title: "游戏", iconId: "game" }
];

export const searchEngines: SearchEngineOption[] = [
  { value: "bing", label: "Bing" },
  { value: "bilibili", label: "哔哩哔哩" },
  { value: "pixiv", label: "Pixiv" }
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
