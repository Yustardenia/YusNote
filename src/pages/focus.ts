import { initAppShell } from "../lib/base";
import { playEffect, setAudioVolume } from "../lib/audio";
import { getAudioPreference, getFocusState, saveFocusState } from "../lib/storage";
import type { FocusSession, FocusState } from "../lib/types";
import { clamp, formatDuration, uid } from "../lib/utils";
import "../styles/global.css";

initAppShell("tools");

type Mode = "focus" | "rest";

const timerEl = document.querySelector<HTMLElement>("#focusTimer");
const statusEl = document.querySelector<HTMLElement>("#focusStatus");
const modeEl = document.querySelector<HTMLElement>("#focusModeLabel");
const countEl = document.querySelector<HTMLElement>("#focusDoneCount");
const minutesEl = document.querySelector<HTMLElement>("#focusDoneMinutes");
const sessionList = document.querySelector<HTMLUListElement>("#focusSessionList");
const toggleButton = document.querySelector<HTMLButtonElement>("#toggleFocusButton");
const resetButton = document.querySelector<HTMLButtonElement>("#resetFocusButton");
const volumeInput = document.querySelector<HTMLInputElement>("#focusVolume");
const autoBreakInput = document.querySelector<HTMLInputElement>("#autoBreak");

let state: FocusState = getFocusState();
let remainingSeconds = state.presetMinutes * 60;
let activeMode: Mode = "focus";
let timer: number | null = null;

function render(): void {
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  const audioPreference = getAudioPreference();

  if (timerEl) timerEl.textContent = `${minutes}:${seconds}`;
  if (modeEl) modeEl.textContent = activeMode === "focus" ? "专注模式" : "休息模式";
  if (countEl) countEl.textContent = `${state.completedCount}`;
  if (minutesEl) minutesEl.textContent = formatDuration(state.totalMinutes);
  if (statusEl) statusEl.textContent = timer ? "计时中" : "准备开始";
  if (volumeInput) volumeInput.value = String(Math.round(audioPreference.volume * 100));
  if (autoBreakInput) autoBreakInput.checked = state.autoStartBreak;

  if (!sessionList) return;
  sessionList.innerHTML = "";
  if (state.sessions.length === 0) {
    sessionList.innerHTML = `<li class="empty-state">今天还没有完成任何一段专注，可以先从 25 分钟开始。</li>`;
    return;
  }

  state.sessions
    .slice()
    .reverse()
    .forEach((session) => {
      const node = document.createElement("li");
      node.className = "mini-item";
      node.innerHTML = `
        <div>
          <strong>${session.mode === "focus" ? "专注" : "休息"} ${session.minutes} 分钟</strong>
          <span class="muted">${new Date(session.finishedAt).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit"
          })}</span>
        </div>
      `;
      sessionList.appendChild(node);
    });
}

function persistState(): void {
  saveFocusState(state);
}

function setMode(minutes: number, mode: Mode): void {
  activeMode = mode;
  state.presetMinutes = minutes;
  remainingSeconds = minutes * 60;
  persistState();
  render();
}

function completeSession(): void {
  if (activeMode === "focus") {
    state.completedCount += 1;
    state.totalMinutes += state.presetMinutes;
  }

  const record: FocusSession = {
    id: uid("focus"),
    finishedAt: new Date().toISOString(),
    minutes: state.presetMinutes,
    mode: activeMode
  };
  state.sessions.push(record);
  persistState();
  playEffect("focusComplete");

  if (activeMode === "focus" && state.autoStartBreak) {
    setMode(5, "rest");
  }
  render();
}

function tick(): void {
  remainingSeconds -= 1;
  if (remainingSeconds <= 0) {
    if (timer) window.clearInterval(timer);
    timer = null;
    completeSession();
    remainingSeconds = state.presetMinutes * 60;
    if (toggleButton) toggleButton.textContent = "开始";
  }
  render();
}

toggleButton?.addEventListener("click", () => {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
    toggleButton.textContent = "继续";
  } else {
    timer = window.setInterval(tick, 1000);
    toggleButton.textContent = "暂停";
  }
  render();
});

resetButton?.addEventListener("click", () => {
  if (timer) window.clearInterval(timer);
  timer = null;
  remainingSeconds = state.presetMinutes * 60;
  if (toggleButton) toggleButton.textContent = "开始";
  render();
});

document.querySelectorAll<HTMLButtonElement>("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = Number(button.dataset.preset ?? 25);
    const mode = (button.dataset.mode as Mode) ?? "focus";
    if (timer) {
      window.clearInterval(timer);
      timer = null;
      if (toggleButton) toggleButton.textContent = "开始";
    }
    setMode(minutes, mode);
  });
});

document.querySelector<HTMLFormElement>("#customPresetForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const minutes = Number(document.querySelector<HTMLInputElement>("#customMinutes")?.value ?? 0);
  const mode = (document.querySelector<HTMLSelectElement>("#customMode")?.value as Mode) ?? "focus";
  if (!minutes) return;
  setMode(clamp(minutes, 1, 180), mode);
});

volumeInput?.addEventListener("input", () => {
  const next = clamp(Number(volumeInput.value) / 100, 0, 1);
  state.volume = next;
  persistState();
  setAudioVolume(next);
});

autoBreakInput?.addEventListener("change", () => {
  state.autoStartBreak = autoBreakInput.checked;
  persistState();
});

render();
