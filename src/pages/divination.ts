import { trigrams } from "../data/trigrams";
import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("tools");

type CoinResult = 6 | 7 | 8 | 9;

const linesMount = document.querySelector<HTMLElement>("#hexagramLines");
const nameMount = document.querySelector<HTMLElement>("#guaName");
const summaryMount = document.querySelector<HTMLElement>("#guaSummary");
const adviceMount = document.querySelector<HTMLElement>("#guaAdvice");

function castLine(): CoinResult {
  const total = Array.from({ length: 3 }).reduce((sum) => sum + (Math.random() > 0.5 ? 3 : 2), 0);
  return total as CoinResult;
}

function lineToBit(value: CoinResult): "0" | "1" {
  return value === 7 || value === 9 ? "1" : "0";
}

function lineToHtml(value: CoinResult): string {
  const changing = value === 6 || value === 9 ? `<span class="pill">动爻</span>` : "";
  if (value === 7 || value === 9) {
    return `<div class="mini-item"><div style="width: 100%; border-top: 8px solid var(--text);"></div>${changing}</div>`;
  }
  return `<div class="mini-item"><div style="display:flex; gap: 20px; width: 100%;"><span style="flex:1; border-top: 8px solid var(--text);"></span><span style="flex:1; border-top: 8px solid var(--text);"></span></div>${changing}</div>`;
}

function renderCast(): void {
  const lines = Array.from({ length: 6 }, castLine);
  const lower = lines.slice(0, 3).map(lineToBit).join("");
  const upper = lines.slice(3, 6).map(lineToBit).join("");
  const lowerTri = trigrams[lower];
  const upperTri = trigrams[upper];
  const changing = lines
    .map((value, index) => ({ value, index: index + 1 }))
    .filter((line) => line.value === 6 || line.value === 9)
    .map((line) => `第 ${line.index} 爻`)
    .join("、");

  if (linesMount) {
    linesMount.innerHTML = lines
      .slice()
      .reverse()
      .map((line) => lineToHtml(line))
      .join("");
  }

  if (nameMount) {
    nameMount.textContent = `${upperTri.name}上${lowerTri.name}下 ${upperTri.symbol}${lowerTri.symbol}`;
  }

  if (summaryMount) {
    summaryMount.textContent = `上卦为${upperTri.element}，主 ${upperTri.keyword}；下卦为${lowerTri.element}，主 ${lowerTri.keyword}。${changing ? `本次出现动爻：${changing}。` : "本次没有动爻，宜按当前节奏稳步推进。"}`;
  }

  if (adviceMount) {
    adviceMount.textContent = `${upperTri.action} 同时，${lowerTri.action}`;
  }
}

document.querySelector<HTMLButtonElement>("#castGuaButton")?.addEventListener("click", renderCast);
