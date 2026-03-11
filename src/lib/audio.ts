import { audioTracks, effectTracks } from "../data/site";
import { getAudioPreference, saveAudioPreference } from "./storage";
import { renderIcon } from "./icons";
import { clamp } from "./utils";

let bgmAudio: HTMLAudioElement | null = null;
let dock: HTMLElement | null = null;

function readPreference() {
  return getAudioPreference();
}

function trackMap() {
  return new Map(audioTracks.map((track) => [track.id, track]));
}

function selectedTrack() {
  const pref = readPreference();
  return trackMap().get(pref.trackId) ?? audioTracks[0];
}

function ensureBgm(): HTMLAudioElement {
  const track = selectedTrack();
  if (!bgmAudio) {
    bgmAudio = new Audio(track.src);
    bgmAudio.loop = true;
    bgmAudio.preload = "auto";
    bgmAudio.dataset.trackId = track.id;
  }

  const pref = readPreference();
  if (bgmAudio.dataset.trackId !== track.id) {
    const shouldResume = !bgmAudio.paused;
    bgmAudio.src = track.src;
    bgmAudio.dataset.trackId = track.id;
    bgmAudio.load();
    if (shouldResume && pref.activated && !pref.muted) {
      void bgmAudio.play().catch(() => undefined);
    }
  }

  bgmAudio.volume = pref.volume;
  bgmAudio.muted = pref.muted;
  return bgmAudio;
}

function updateDock(): void {
  if (!dock) return;
  const pref = readPreference();
  const track = selectedTrack();
  const audio = ensureBgm();
  const playLabel = audio.paused ? "播放" : "暂停";
  const muteLabel = pref.muted ? "取消静音" : "静音";
  const effectLabel = pref.effectsEnabled ? "音效开" : "音效关";

  dock.querySelector<HTMLElement>("[data-audio-title]")!.textContent = track.title;
  dock.querySelector<HTMLElement>("[data-audio-copy]")!.textContent = pref.activated
    ? track.copy
    : "点击播放后，背景音乐和页面音效才会被唤醒。";
  dock.querySelector<HTMLInputElement>("[data-audio-volume]")!.value = String(
    Math.round(pref.volume * 100)
  );

  const playButton = dock.querySelector<HTMLButtonElement>("[data-audio-action='toggle']")!;
  playButton.innerHTML = `${renderIcon(audio.paused ? "play" : "pause", "button-icon")}<span>${playLabel}</span>`;

  const muteButton = dock.querySelector<HTMLButtonElement>("[data-audio-action='mute']")!;
  muteButton.innerHTML = `${renderIcon(pref.muted ? "mute" : "volume", "button-icon")}<span>${muteLabel}</span>`;

  const effectButton = dock.querySelector<HTMLButtonElement>("[data-audio-action='effects']")!;
  effectButton.dataset.active = pref.effectsEnabled ? "true" : "false";
  effectButton.innerHTML = `${renderIcon("sparkle", "button-icon")}<span>${effectLabel}</span>`;
}

export function mountAudioDock(): void {
  if (dock) {
    updateDock();
    return;
  }

  dock = document.createElement("aside");
  dock.className = "audio-dock";
  dock.innerHTML = `
    <div class="audio-dock__meta">
      <span class="eyebrow eyebrow--small">${renderIcon("music", "eyebrow-icon")}Audio Room</span>
      <strong data-audio-title></strong>
      <p data-audio-copy></p>
    </div>
    <div class="audio-dock__actions">
      <button class="ghost-button icon-button" type="button" data-audio-action="toggle"></button>
      <button class="ghost-button icon-button" type="button" data-audio-action="next">${renderIcon("next", "button-icon")}<span>换曲</span></button>
      <button class="ghost-button icon-button" type="button" data-audio-action="mute"></button>
      <button class="ghost-button icon-button" type="button" data-audio-action="effects"></button>
    </div>
    <label class="audio-dock__range">
      <span>音量</span>
      <input type="range" min="0" max="100" step="1" data-audio-volume />
    </label>
  `;

  document.body.appendChild(dock);

  dock.querySelectorAll<HTMLButtonElement>("[data-audio-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.audioAction;
      if (action === "toggle") {
        await toggleAudioPlayback();
      } else if (action === "next") {
        await switchToNextTrack();
      } else if (action === "mute") {
        toggleMute();
      } else if (action === "effects") {
        toggleEffects();
      }
      updateDock();
    });
  });

  dock.querySelector<HTMLInputElement>("[data-audio-volume]")?.addEventListener("input", (event) => {
    const input = event.currentTarget as HTMLInputElement;
    setAudioVolume(Number(input.value) / 100);
  });

  updateDock();
}

export async function toggleAudioPlayback(): Promise<void> {
  const pref = readPreference();
  saveAudioPreference({
    ...pref,
    activated: true
  });

  const audio = ensureBgm();
  if (audio.paused) {
    await audio.play().catch(() => undefined);
  } else {
    audio.pause();
  }
  updateDock();
}

export async function switchToNextTrack(): Promise<void> {
  const pref = readPreference();
  const currentIndex = audioTracks.findIndex((track) => track.id === pref.trackId);
  const nextTrack = audioTracks[(currentIndex + 1) % audioTracks.length] ?? audioTracks[0];
  const shouldResume = !ensureBgm().paused;

  saveAudioPreference({
    ...pref,
    activated: true,
    trackId: nextTrack.id
  });

  ensureBgm();
  if (shouldResume) {
    await ensureBgm()
      .play()
      .catch(() => undefined);
  }
  updateDock();
}

export function setAudioVolume(value: number): void {
  const pref = readPreference();
  const next = clamp(value, 0, 1);
  saveAudioPreference({
    ...pref,
    volume: next
  });
  if (bgmAudio) {
    bgmAudio.volume = next;
  }
  updateDock();
}

export function toggleMute(): void {
  const pref = readPreference();
  saveAudioPreference({
    ...pref,
    muted: !pref.muted
  });
  if (bgmAudio) {
    bgmAudio.muted = !pref.muted;
  }
  updateDock();
}

export function toggleEffects(): void {
  const pref = readPreference();
  saveAudioPreference({
    ...pref,
    effectsEnabled: !pref.effectsEnabled
  });
  updateDock();
}

export function playEffect(kind: keyof typeof effectTracks): void {
  const pref = readPreference();
  if (!pref.activated || pref.muted || !pref.effectsEnabled) return;
  const sound = new Audio(effectTracks[kind]);
  sound.volume = clamp(pref.volume * 0.8, 0, 1);
  void sound.play().catch(() => undefined);
}
