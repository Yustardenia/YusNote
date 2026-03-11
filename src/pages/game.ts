import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("tools");

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas");
const scoreEl = document.querySelector<HTMLElement>("#gameScore");
const bestEl = document.querySelector<HTMLElement>("#gameBest");
const startButton = document.querySelector<HTMLButtonElement>("#startGameButton");

const bestKey = "yusnote.game.best";
let best = Number(window.localStorage.getItem(bestKey) ?? 0);
let score = 0;
let running = false;
let frame = 0;
let player = { x: 550, y: 500, radius: 16 };
let enemies: { x: number; y: number; size: number; speed: number }[] = [];
let points: { x: number; y: number; radius: number; speed: number }[] = [];

if (bestEl) bestEl.textContent = `${best}`;

function resizeCanvas(): void {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
}

function draw(): void {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const width = canvas.width / devicePixelRatio;
  const height = canvas.height / devicePixelRatio;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0e1825";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#4fd6ff";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff6d5a";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });

  ctx.fillStyle = "#57e39f";
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function resetGame(): void {
  score = 0;
  frame = 0;
  enemies = [];
  points = [];
  if (scoreEl) scoreEl.textContent = "0";
}

function endGame(): void {
  running = false;
  if (score > best) {
    best = score;
    window.localStorage.setItem(bestKey, String(best));
    if (bestEl) bestEl.textContent = `${best}`;
  }
  startButton!.textContent = "重新开始";
}

function loop(): void {
  if (!running || !canvas) return;
  frame += 1;
  const width = canvas.width / devicePixelRatio;
  const height = canvas.height / devicePixelRatio;

  if (frame % 40 === 0) {
    enemies.push({ x: Math.random() * (width - 30), y: -30, size: 24, speed: 2 + score / 500 });
  }
  if (frame % 55 === 0) {
    points.push({ x: Math.random() * (width - 20), y: -20, radius: 10, speed: 2.8 });
  }

  enemies = enemies.filter((enemy) => {
    enemy.y += enemy.speed;
    const hit =
      player.x + player.radius > enemy.x &&
      player.x - player.radius < enemy.x + enemy.size &&
      player.y + player.radius > enemy.y &&
      player.y - player.radius < enemy.y + enemy.size;
    if (hit) {
      endGame();
      return false;
    }
    return enemy.y < height + 40;
  });

  points = points.filter((point) => {
    point.y += point.speed;
    const hit = Math.hypot(point.x - player.x, point.y - player.y) < player.radius + point.radius;
    if (hit) {
      score += 100;
      if (scoreEl) scoreEl.textContent = `${score}`;
      return false;
    }
    return point.y < height + 40;
  });

  draw();
  window.requestAnimationFrame(loop);
}

startButton?.addEventListener("click", () => {
  if (!canvas) return;
  resetGame();
  running = true;
  startButton.textContent = "进行中";
  loop();
});

canvas?.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  player.x = event.clientX - rect.left;
  player.y = event.clientY - rect.top;
});

canvas?.addEventListener("touchmove", (event) => {
  const rect = canvas.getBoundingClientRect();
  player.x = event.touches[0].clientX - rect.left;
  player.y = event.touches[0].clientY - rect.top;
});

window.addEventListener("resize", () => {
  resizeCanvas();
  draw();
});

resizeCanvas();
draw();
