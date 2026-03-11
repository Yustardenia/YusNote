import type { IconId } from "./types";

const icons: Record<IconId, string> = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11.5 12 4l9 7.5"/><path d="M6 10.5V20h12v-9.5"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7Z"/><path d="m5 15 .6 1.8L7.5 18l-1.9.6L5 20.5l-.6-1.9L2.5 18l1.9-.7Z"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M8 7h8"/><path d="M8 11h8"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 9 18Z"/><path d="M19 16a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 19 16Z"/><path d="M9 18V6l10-2v12"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.5 6.5 0 1 0 20 14.5Z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="m4.9 4.9 2.2 2.2"/><path d="m16.9 16.9 2.2 2.2"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="m4.9 19.1 2.2-2.2"/><path d="m16.9 7.1 2.2-2.2"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 11 7-11 7z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>`,
  next: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m6 6 8 6-8 6z"/><path d="m14 6 8 6-8 6z"/></svg>`,
  mute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 9v6h4l5 4V5L9 9Z"/><path d="m18 9 4 6"/><path d="m22 9-4 6"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 9v6h4l5 4V5L9 9Z"/><path d="M18 9.5a4.5 4.5 0 0 1 0 5"/><path d="M20.5 7a8 8 0 0 1 0 10"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M3 10h18"/></svg>`,
  board: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M15 4v16"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>`,
  brush: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m14 4 6 6"/><path d="m11 7 6 6"/><path d="m3 21 4.5-1 10-10-3.5-3.5-10 10Z"/><path d="M4 17c-.3 1.5-.9 2.9-2 4 1.8-.1 3.2-.7 4-2"/></svg>`,
  compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4v12"/><path d="m5 13 3 3 3-3"/><path d="M16 20V8"/><path d="m13 11 3-3 3 3"/></svg>`,
  rename: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h10"/><path d="M4 12h16"/><path d="M4 18h8"/><path d="m17 4 3 3"/><path d="m14 10 6-6"/></svg>`,
  keyword: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8h11"/><path d="M4 12h8"/><path d="M4 16h11"/><path d="m17.5 11 2 2 3.5-4"/></svg>`,
  divination: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  game: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="8" width="16" height="8" rx="4"/><path d="M8 12h4"/><path d="M10 10v4"/><circle cx="16.5" cy="11" r=".8" fill="currentColor"/><circle cx="18.5" cy="13" r=".8" fill="currentColor"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .6A12 12 0 0 0 8.2 24c.6.1.8-.2.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.6-1.3-5.6-6A4.7 4.7 0 0 1 6.5 8.1c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1A4.7 4.7 0 0 1 20.5 12c0 4.8-2.9 5.7-5.7 6 .5.4.9 1.1.9 2.2v3.2c0 .4.2.7.8.6A12 12 0 0 0 12 .6Z"/></svg>`,
  bilibili: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="11" rx="3"/><path d="m9 4 2 3"/><path d="m15 4-2 3"/><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M8 15c1.1-.8 2.4-1.2 4-1.2s2.9.4 4 1.2"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 8.5a3 3 0 0 0-2.1-2.1C17.7 6 12 6 12 6s-5.7 0-7.5.4A3 3 0 0 0 2.4 8.5C2 10.3 2 12 2 12s0 1.7.4 3.5a3 3 0 0 0 2.1 2.1C6.3 18 12 18 12 18s5.7 0 7.5-.4a3 3 0 0 0 2.1-2.1C22 13.7 22 12 22 12s0-1.7-.4-3.5ZM10 14.8V9.2l5 2.8-5 2.8Z"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="14" height="12" rx="2"/><path d="m17 10 4-2v8l-4-2Z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 17.5l-5.8 3 1.1-6.5-4.7-4.6 6.5-1z"/></svg>`,
  library: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4v16H5z"/><path d="M10 4h4v16h-4z"/><path d="M15 6h4v14h-4z"/></svg>`,
  controller: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 10h10a4 4 0 0 1 3.9 4.8l-.4 1.7a2 2 0 0 1-3.2 1L15 15H9l-2.3 2.5a2 2 0 0 1-3.2-1l-.4-1.7A4 4 0 0 1 7 10Z"/><path d="M8 13h3"/><path d="M9.5 11.5v3"/><circle cx="16.5" cy="12.5" r=".9" fill="currentColor"/><circle cx="18.5" cy="14.5" r=".9" fill="currentColor"/></svg>`,
  audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M19 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M9 18V6l10-2v10"/></svg>`,
  showcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16v12H4z"/><path d="m4 18 5-5 3 3 4-5 4 7"/></svg>`,
  instruction: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a4 4 0 0 1 4 4c0 2.6-1.6 3.7-2.5 4.3-.8.5-1 .7-1 1.2V14"/><path d="M7.2 5.2A8.8 8.8 0 1 0 20.8 16"/><path d="M12 18h.01"/><path d="M15 3c.8.2 1.6.6 2.2 1.2"/><path d="M18 1.8c.6 1 1.4 1.8 2.4 2.4"/><path d="M19.8 5c-.8.3-1.5.8-2 1.4"/></svg>`,
  archive: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="4" rx="1.5"/><path d="M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z"/><path d="M10 13h4"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4 3 20h18L12 4Z"/><path d="M12 9v5"/><path d="M12 17h.01"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.4-9.4-8.6C.7 9.2 2 5.6 5.3 4.5A5.5 5.5 0 0 1 12 6.3a5.5 5.5 0 0 1 6.7-1.8c3.3 1.1 4.6 4.7 2.7 7.9C19 16.6 12 21 12 21Z"/></svg>`,
  flower: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2.5"/><path d="M12 5c1.4-2 4.5-2.2 5.7.2 1 2-.2 4.3-2.5 4.8"/><path d="M19 12c2-1.4 2.2-4.5-.2-5.7-2-1-4.3.2-4.8 2.5"/><path d="M12 19c-1.4 2-4.5 2.2-5.7-.2-1-2 .2-4.3 2.5-4.8"/><path d="M5 12c-2 1.4-2.2 4.5.2 5.7 2 1 4.3-.2 4.8-2.5"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 14 8 16a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0"/><path d="m14 10 2-2a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4 0"/><path d="m8.5 15.5 7-7"/></svg>`
};

export function renderIcon(iconId: IconId, className = "icon-mark"): string {
  return `<span class="${className}" aria-hidden="true">${icons[iconId] ?? icons.link}</span>`;
}
