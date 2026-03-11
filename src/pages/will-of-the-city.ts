import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("docs");

interface InstructionEntry {
  type: string;
  primary: string;
  secondary: string;
  footer: string;
  tags: string[];
}

const subjects = [
  "请在晚上九点整点一份外卖",
  "请在下一次听见门铃时立即换上最正式的衣服",
  "请在一分钟之内喝下一升温牛奶",
  "请在凌晨两点给自己写一封绝不寄出的辞职信",
  "请在最困倦的时候认真整理抽屉最底层",
  "请在看见月亮之前为一盏不属于你的灯命名",
  "请在今天结束前把一张空白纸放进口袋",
  "请在电梯门即将关闭时轻声说出自己的全名",
  "请在下次感到被约束时给自己放二十四小时的无理由假期",
  "请在便利店里只购买最没有必要的那样东西",
  "请在今晚把手机调成静音后继续等待一个不会到来的通知",
  "请在雨停之前把鞋带系成同样的长度"
];

const conditions = [
  "若超时",
  "若你感觉被观察",
  "若你在过程中想解释自己",
  "若你中途产生悔意",
  "若你听见有人叫你的名字",
  "若你忽然想起很久以前的某个房间",
  "若你被任何人询问原因",
  "若你发现自己已经完成过一次",
  "若你无法确认现在是否足够安静",
  "若你开始怀疑这条指令的必要性"
];

const consequences = [
  "就并且只给外卖员一块钱配送费",
  "就把接下来的沉默延长到整点之后",
  "就把那一分钟视为今天唯一有效的休息",
  "就假装一切只是你偶然想起的习惯",
  "就把原本要说出口的话重新吞回去",
  "就把多余的动作全部取消",
  "就将那份迟疑记作本次执行的附加成本",
  "就把原定目标改写成更琐碎的一件事",
  "就把你此刻的表情调整得毫无异常",
  "就把这次偏差算作允许范围内的损耗"
];

const restrictions = [
  "并且全程不让任何人发现",
  "并且全程保持沉默一句话也不说",
  "并且不得为自己做任何解释",
  "并且只可在心里重复三次",
  "并且不要向后来的人提起这件事",
  "并且必须装作这本来就是你今日的计划",
  "并且不要让镜子看见你执行时的表情",
  "并且不得在完成后立即松一口气",
  "并且不要留下可以被复盘的证据",
  "并且在最后十秒内假装自己从未犹豫"
];

const annotations = [
  "附记：若你觉得这条指令过于荒唐，说明你暂时还适合继续执行。",
  "附记：你无需理解命令的善意，只需维持表面的顺从。",
  "附记：若过程显得无意义，请优先怀疑自己的尺度。",
  "附记：城市不会为你确认完成状态，但会记录你试图逃避的部分。",
  "附记：保持自然，比保持正确更加重要。",
  "附记：没有旁观者时也要维持被审阅的姿态。",
  "附记：你可以害怕，但不要让害怕先离场。",
  "附记：执行者不拥有提问权，只拥有拖延的幻觉。",
  "附记：若你在最后一刻想撤回，请把撤回动作也一并完成。",
  "附记：一切看似不必要的细节，都只是在测试你是否仍愿意服从。"
];

const typeLabels = ["食指回执", "夜间指令", "城市广播", "低频密令", "隐秘任务", "异常归档"];
const archiveTags = ["静音回路", "站台回声", "深夜备案", "不可复述", "局部偏差", "档案留痕", "月面收件", "代价已记"];
const scrambleChars = "致请若并且只可不得保持沉默0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const primaryNode = document.querySelector<HTMLElement>("#cityLinePrimary");
const secondaryNode = document.querySelector<HTMLElement>("#cityLineSecondary");
const typeNode = document.querySelector<HTMLElement>("#cityBroadcastType");
const codeNode = document.querySelector<HTMLElement>("#cityBroadcastCode");
const tagsNode = document.querySelector<HTMLElement>("#cityTags");
const footerNode = document.querySelector<HTMLElement>("#cityFooter");
const generateButton = document.querySelector<HTMLButtonElement>("#cityGenerateButton");
const copyButton = document.querySelector<HTMLButtonElement>("#cityCopyButton");
const sidebar = document.querySelector<HTMLElement>("#citySidebar");
const sidebarBody = document.querySelector<HTMLElement>("#citySidebarBody");
const sidebarToggle = document.querySelector<HTMLButtonElement>("#citySidebarToggle");

function randomOf<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickTags(): string[] {
  const pool = [...archiveTags];
  const picked: string[] = [];
  while (picked.length < 3 && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function buildEntry(): InstructionEntry {
  const subject = randomOf(subjects);
  const condition = randomOf(conditions);
  const consequence = randomOf(consequences);
  const restriction = randomOf(restrictions);
  const code = `Signal ${String(Math.floor(Math.random() * 900) + 100)}`;
  if (codeNode) codeNode.textContent = code;

  return {
    type: randomOf(typeLabels),
    primary: `致：${subject}${condition}${consequence}，${restriction}。`,
    secondary: randomOf(annotations),
    footer: `归档备注：该指令已被转写进夜间档案。若你试图解释自己，说明本次执行尚未结束。`,
    tags: pickTags()
  };
}

function scrambleTo(node: HTMLElement | null, text: string, speed = 18): void {
  if (!node) return;
  let frame = 0;
  const total = text.length * 2 + 6;

  const timer = window.setInterval(() => {
    const output = text
      .split("")
      .map((char, index) => {
        if (char === " " || char === "：" || char === "，" || char === "。") return char;
        if (index < frame / 2) return char;
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      })
      .join("");

    node.textContent = output;
    frame += 1;
    if (frame >= total) {
      window.clearInterval(timer);
      node.textContent = text;
    }
  }, speed);
}

function renderTags(items: string[]): void {
  if (!tagsNode) return;
  tagsNode.innerHTML = items.map((tag) => `<span class="tag-chip">📎 ${tag}</span>`).join("");
}

function renderEntry(entry: InstructionEntry): void {
  if (typeNode) typeNode.textContent = entry.type;
  if (footerNode) footerNode.textContent = entry.footer;
  renderTags(entry.tags);
  scrambleTo(primaryNode, entry.primary, 16);
  window.setTimeout(() => scrambleTo(secondaryNode, entry.secondary, 14), 220);
}

function currentText(): string {
  return [primaryNode?.textContent ?? "", secondaryNode?.textContent ?? ""].filter(Boolean).join("\n");
}

function syncSidebarState(forceDesktop = false): void {
  const mobile = window.innerWidth <= 1060;
  if (!mobile || forceDesktop) {
    sidebar?.classList.remove("is-collapsed");
    if (sidebarBody) sidebarBody.hidden = false;
    if (sidebarToggle) sidebarToggle.textContent = "收起控制栏";
    return;
  }
  const collapsed = sidebar?.classList.contains("is-collapsed") ?? false;
  if (sidebarBody) sidebarBody.hidden = collapsed;
  if (sidebarToggle) sidebarToggle.textContent = collapsed ? "展开控制栏" : "收起控制栏";
}

generateButton?.addEventListener("click", () => {
  renderEntry(buildEntry());
});

copyButton?.addEventListener("click", async () => {
  const text = currentText();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "已复制";
    window.setTimeout(() => {
      copyButton.textContent = "复制文本";
    }, 1200);
  } catch {
    window.alert(text);
  }
});

sidebarToggle?.addEventListener("click", () => {
  if (window.innerWidth > 1060) return;
  sidebar?.classList.toggle("is-collapsed");
  syncSidebarState();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1060) {
    syncSidebarState(true);
  } else {
    syncSidebarState();
  }
});

if (window.innerWidth <= 1060) {
  sidebar?.classList.add("is-collapsed");
}
syncSidebarState();
renderEntry(buildEntry());
