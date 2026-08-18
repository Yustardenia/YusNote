import { initAppShell } from "../lib/base";
import { escapeHtml } from "../lib/utils";
import "../styles/global.css";

initAppShell("tools");

type RepoRef = { owner: string; name: string };

interface GameJamEntry {
  title: string;
  jamName: string;
  date: string;
  genre: string;
  theme: string;
  description: string;
  repo?: RepoRef;
  link?: string;
  linkLabel?: string;
  cover?: string;
}

const entries: GameJamEntry[] = [
  {
    title: "黑白冲刺",
    jamName: "土豆丝招新GJ",
    date: "2025-02-07",
    genre: "平台跳跃",
    theme: "三个按键",
    description:
      "小黑球持续向右冲刺，Space 跳跃，Shift 加速，J 反转场景颜色；只有与小球同色的物块才有实体，切色决定能走的路。",
    cover: "/assets/gamejam/blackwhite.png"
  },
  {
    title: "触忆",
    jamName: "游鱼思GJ",
    date: "2025-05-30",
    genre: "类密室逃脱解密",
    theme: "伸手 / 回忆感",
    description:
      "在记忆逐渐模糊的世界里，你化身记忆障碍的老奶奶，以“手（鼠标）触碰旧物”唤醒残存片段，在消散边缘寻找温情的回忆。",
    repo: { owner: "DongyangSpiral", name: "TouchMemories" },
    cover: "/assets/gamejam/touchmemory.png"
  },
  {
    title: "你的傲娇四川老婆",
    jamName: "Unity中国开发挑战赛·48小时小游戏创作派对-成都站",
    date: "2025-09-19",
    genre: "类东方弹幕射击",
    theme: "耙耳朵",
    description:
      "扮演惹老婆生气的耙耳朵，在弹幕中穿梭躲避，同时拾取包包、化妆品等道具降低火气值，把关系拉回安全线。",
    repo: { owner: "Yustardenia", name: "UnityChinaGameJam-YourSiChuanWife" },
    cover: "/assets/gamejam/SiChuanWife.png"
  },
  {
    title: "Stardenia",
    jamName: "TapTap聚光灯游戏创作挑战",
    date: "2025-10-10",
    genre: "RPG",
    theme: "你确定这不是 BUG 吗？",
    description:
      "“如果世界不是由二进制构成，该有多好。”作为测试员的你清理那些被标记为“多余”的 Bug —— 你会放过它们吗？",
    cover: "/assets/gamejam/Stardenia.png"
    ,
    link: "https://www.taptap.cn/app/779458",
    linkLabel: "TapTap"
  },
  {
    title: "关于我加班猝死灵魂附身在自动贩卖机这件事",
    jamName: "2025 聚光灯 GameJam 48H成都场",
    date: "2025-12-19",
    genre: "类模拟经营的益智两位小数算术",
    theme: "模拟器",
    description:
      "社畜猝死后灵魂附身在自动贩卖机。你要管理补货、定价、投币与出货流程，让这台机器继续运转。",
    repo: { owner: "Yustardenia", name: "TapTap48hGJ" },
    cover: "/assets/gamejam/machine.png"
  },
  {
    title: "遮见",
    jamName: "2026全球游戏创作马拉松 (GlobalGameJam)",
    date: "2026-01-30",
    genre: "类密室逃脱解密",
    theme: "Mask",
    description:
      "一念摘戴，阴阳两隔。偶然的驻足让你困在死寂古宅，红纱覆面时才惊觉——所见是真相，还是被安排的宿命？",
    repo: { owner: "Yustardenia", name: "GlobalGameJam2026-ObstructedView" },
    cover: "/assets/gamejam/Mask.png"
  },
  {
    title: "DOTS",
    jamName: "2026大学生游戏社团联盟GameJam（萌芽GameJam）",
    date: "2026-01-30",
    genre: "三人联机卡牌",
    theme: "Dot",
    description:
      "三人联机卡牌对局，混合 Dot 点数牌与 Effect 效果牌；通过打空手牌或触发胜利条件取胜，回合与全局事件均带随机性。",
    repo: { owner: "Yustardenia", name: "MengYaGameJam2026-DOTS" },
    cover: "/assets/gamejam/DOTS.png"
  },
  {
    title: "幻想朋友",
    jamName: "BOOOMJam游戏创作挑战2026",
    date: "2026-04-24",
    genre: "解谜",
    theme: "幻想朋友",
    description:
      "每晚关灯后，黑暗中总藏着看不见的怪物。操控孩子在漆黑房间里移动、拾取物品：睁眼只能看见模糊的现实轮廓，闭眼则进入里世界，发现隐藏的光源与传送点。利用同色光源传送，关闭或遮挡所有发光物；房间越暗，幻想朋友越强，但黑暗也会让孩子逐渐被里世界同化。信任朋友，还是相信自己？每一条路都通往不同的夜晚。",
    cover: "/assets/gamejam/fantasy-friends.png"
  }
];

function renderCard(entry: GameJamEntry): string {
  const tags = [
    `<span class="tag-chip">${escapeHtml(entry.genre)}</span>`,
    `<span class="tag-chip">${escapeHtml(entry.theme)}</span>`
  ].join("");
  const repo = entry.repo
    ? `<div class="gamejam-repo">
        <img src="https://opengraph.githubassets.com/1/${entry.repo.owner}/${entry.repo.name}" alt="${escapeHtml(entry.repo.owner)}/${escapeHtml(entry.repo.name)}" loading="lazy" />
        <div class="gamejam-repo__actions">
          <span>${escapeHtml(entry.repo.owner)}/${escapeHtml(entry.repo.name)}</span>
          <a class="ghost-button" href="https://github.com/${entry.repo.owner}/${entry.repo.name}" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>`
    : "";
  const repoEmpty = entry.repo ? "" : `<div class="gamejam-repo gamejam-repo--empty">Repo 未发布</div>`;
  const external = entry.link
    ? `<div class="gamejam-link">
        <a class="ghost-button" href="${entry.link}" target="_blank" rel="noreferrer">${escapeHtml(entry.linkLabel ?? "外部链接")}</a>
      </div>`
    : "";
  const cover = entry.cover
    ? `<div class="gamejam-cover"><img src="${entry.cover}" alt="${escapeHtml(entry.title)}" loading="lazy" data-cover /></div>`
    : "";
  return `
    <article class="gamejam-card">
      ${cover}
      <div class="gamejam-card__head">
        <div>
          <div class="card-kicker">${escapeHtml(entry.jamName)}</div>
          <div class="gamejam-date">${escapeHtml(entry.date)}</div>
        </div>
      </div>
      <div class="gamejam-card__body">
        <h2 class="card-title">${escapeHtml(entry.title)}</h2>
        <div class="card-tags">${tags}</div>
        <p class="card-copy">${escapeHtml(entry.description)}</p>
      </div>
      ${repo || repoEmpty}
      ${external}
    </article>
  `;
}

function renderGameJam(): void {
  const grid = document.querySelector<HTMLElement>("#gamejamGrid");
  if (!grid) return;
  grid.innerHTML = entries.map(renderCard).join("");
  grid.querySelectorAll<HTMLImageElement>("[data-cover]").forEach((image) => {
    image.addEventListener("error", () => {
      const wrapper = image.closest(".gamejam-cover");
      if (wrapper) wrapper.remove();
    });
  });
  grid.querySelectorAll<HTMLElement>(".gamejam-card").forEach((card, index) => {
    card.style.setProperty("--delay", `${index * 60}ms`);
    card.classList.add("is-ready");
  });
}

renderGameJam();

function mountTitleEffect(): void {
  const title = document.querySelector<HTMLElement>("#gamejamTitle");
  if (!title) return;
  const text = title.textContent ?? "";
  title.textContent = "";
  const chars: { element: HTMLSpanElement; x: number; y: number }[] = [];
  [...text].forEach((char) => {
    const span = document.createElement("span");
    span.className = "gamejam-char";
    span.textContent = char === " " ? "\u00A0" : char;
    title.appendChild(span);
    chars.push({ element: span, x: 0, y: 0 });
  });
  const updatePositions = () => {
    chars.forEach((item) => {
      const rect = item.element.getBoundingClientRect();
      item.x = rect.left + rect.width / 2;
      item.y = rect.top + rect.height / 2;
    });
  };
  updatePositions();
  window.addEventListener("resize", updatePositions);
  let mouseX = -1000;
  let mouseY = -1000;
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    requestAnimationFrame(() => {
      chars.forEach((item) => {
        const dx = mouseX - item.x;
        const dy = mouseY - item.y;
        const distance = Math.hypot(dx, dy);
        const radius = 90;
        if (distance < radius) {
          const normalized = 1 - distance / radius;
          const weight = 200 + normalized * 600;
          item.element.style.fontVariationSettings = `'wght' ${weight}`;
          item.element.style.textShadow = `0 0 ${1 + normalized * 6}px rgba(255, 255, 255, 0.85)`;
        } else {
          item.element.style.fontVariationSettings = "'wght' 200";
          item.element.style.textShadow = "0 0 1px rgba(255, 255, 255, 0.8)";
        }
      });
    });
  });
}

mountTitleEffect();
