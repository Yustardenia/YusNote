import { audioTracks, effectTracks } from "../data/site";
import { getAudioPreference, saveAudioPreference } from "./storage";
import { renderIcon } from "./icons";
import { clamp } from "./utils";

let bgmAudio: HTMLAudioElement | null = null;
let dock: HTMLElement | null = null;
let synthContext: AudioContext | null = null;
let instructionSignalNodes: { oscillator: OscillatorNode; gain: GainNode }[] = [];
let instructionSignalLoop: number | null = null;

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
  const copyNode = dock.querySelector<HTMLElement>("[data-audio-copy]")!;
  copyNode.textContent = pref.activated ? track.copy : "";
  copyNode.hidden = !copyNode.textContent.trim();
  dock.querySelector<HTMLInputElement>("[data-audio-volume]")!.value = String(Math.round(pref.volume * 100));

  const playButton = dock.querySelector<HTMLButtonElement>("[data-audio-action='toggle']")!;
  playButton.innerHTML = `${renderIcon(audio.paused ? "play" : "pause", "button-icon")}<span>${playLabel}</span>`;

  const muteButton = dock.querySelector<HTMLButtonElement>("[data-audio-action='mute']")!;
  muteButton.innerHTML = `${renderIcon(pref.muted ? "mute" : "volume", "button-icon")}<span>${muteLabel}</span>`;

  const effectButton = dock.querySelector<HTMLButtonElement>("[data-audio-action='effects']")!;
  effectButton.dataset.active = pref.effectsEnabled ? "true" : "false";
  effectButton.innerHTML = `${renderIcon("sparkle", "button-icon")}<span>${effectLabel}</span>`;

  dock.dataset.collapsed = pref.collapsed ? "true" : "false";
  const collapseButton = dock.querySelector<HTMLButtonElement>("[data-audio-action='collapse']")!;
  collapseButton.innerHTML = `${renderIcon("music", "button-icon")}<span>${pref.collapsed ? "展开 BGM" : "收起 BGM"}</span>`;
}

export function mountAudioDock(): void {
  if (dock) {
    updateDock();
    return;
  }

  dock = document.createElement("aside");
  dock.className = "audio-dock";
  dock.innerHTML = `
    <button class="ghost-button icon-button audio-dock__collapse" type="button" data-audio-action="collapse"></button>
    <div class="audio-dock__meta">
      <span class="eyebrow eyebrow--small">${renderIcon("music", "eyebrow-icon")}BGM</span>
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
      } else if (action === "collapse") {
        toggleCollapsed();
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
    await ensureBgm().play().catch(() => undefined);
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

export function toggleCollapsed(): void {
  const pref = readPreference();
  saveAudioPreference({
    ...pref,
    collapsed: !pref.collapsed
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

function ensureSynthContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!synthContext) synthContext = new AudioCtor();
  return synthContext;
}

export async function playInstructionSignal(): Promise<boolean> {
  stopInstructionSignal();

  const pref = readPreference();
  if (!pref.activated || pref.muted || !pref.effectsEnabled) return false;

  const context = ensureSynthContext();
  if (!context) return false;

  const hasUserActivation =
    typeof navigator !== "undefined" &&
    "userActivation" in navigator &&
    Boolean(
      (navigator as Navigator & { userActivation?: { hasBeenActive?: boolean; isActive?: boolean } }).userActivation
        ?.hasBeenActive
    );

  if (context.state === "suspended" && !hasUserActivation) {
    return false;
  }

  if (context.state === "suspended") {
    await context.resume().catch(() => undefined);
  }
  if (context.state !== "running") return false;

  const runBeepPair = () => {
    const loopPref = readPreference();
    if (!loopPref.activated || loopPref.muted || !loopPref.effectsEnabled) return;
    triggerInstructionBeepPair(context, clamp(loopPref.volume * 0.038, 0.01, 0.05));
  };

  runBeepPair();
  instructionSignalLoop = window.setInterval(runBeepPair, 340);
  return true;
}

export function stopInstructionSignal(): void {
  if (instructionSignalLoop !== null) {
    window.clearInterval(instructionSignalLoop);
    instructionSignalLoop = null;
  }

  stopActiveInstructionNodes();
}

function stopActiveInstructionNodes(): void {
  if (instructionSignalNodes.length === 0) return;

  const context = ensureSynthContext();
  const stopAt = context ? context.currentTime + 0.03 : 0;

  instructionSignalNodes.forEach(({ oscillator, gain }) => {
    try {
      if (context) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.setValueAtTime(gain.gain.value || 0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        oscillator.stop(stopAt + 0.02);
      } else {
        oscillator.stop();
      }
    } catch {
      // Ignore already-stopped nodes.
    }
  });

  instructionSignalNodes = [];
}

function triggerInstructionBeepPair(context: AudioContext, peak: number): void {
  stopActiveInstructionNodes();

  const startAt = context.currentTime + 0.01;
  const pattern = [
    { frequency: 1240, delay: 0, duration: 0.08 },
    { frequency: 1080, delay: 0.12, duration: 0.08 }
  ];

  instructionSignalNodes = pattern.map(({ frequency, delay, duration }) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = startAt + delay;
    const notePeak = noteStart + 0.02;
    const noteEnd = noteStart + duration;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, noteStart);

    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(peak, notePeak);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd + 0.02);

    return { oscillator, gain };
  });
}

