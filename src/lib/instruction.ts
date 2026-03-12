import instructionAsset from "../assets/images/instruction.png";

export interface InstructionEntry {
  primary: string;
  iconAsset: string;
  meta?: {
    templateId: string;
  };
}

interface RandomCountToken {
  value: number;
  cardinal: string;
  ordinal: string;
}

interface InstructionContext {
  counts: RandomCountToken[];
  rareCounts: RandomCountToken[];
}

interface InstructionTemplate {
  id: string;
  build(context: InstructionContext): string;
}

const hanDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
let activeScrambleToken = 0;

const timeAnchors = [
  "中午十二点整",
  "凌晨两点十三分",
  "下一个整点开始时",
  "电梯门将要合上的前一秒",
  "你准备说出自己名字之前",
  "雨停后地面还发亮的时候",
  "你看见第三次反光之后",
  "最近的钟表跳到整分时",
  "你听见有人清嗓子的那一刻",
  "经过最后一盏亮灯时"
];

const places = [
  "路口",
  "楼梯平台",
  "自动贩卖机前",
  "屋顶边缘退后一步的位置",
  "窗帘后面",
  "长椅旁边",
  "走廊尽头",
  "厨房门口",
  "最近的镜子前",
  "公交站牌下",
  "门缝旁",
  "没有人会停留太久的地方",
  "最安静的角落",
  "被灯照得最亮的位置",
  "你本不该进去的地方"
];

const observers = [
  "第{n}片树叶",
  "第{n}个影子",
  "最近的门把手",
  "最亮的灯下的东西",
  "刚刚经过你的脚步声",
  "没有被注意到的按钮",
  "第{n}个路过的人",
  "你最先看到的反光",
  "并不存在的空位",
  "还没来得及关上的门",
  "被遗忘的纸杯",
  "最靠近你的台阶"
];

const objects = [
  "纸条",
  "雨伞",
  "鞋带",
  "纸杯",
  "门把手",
  "按钮",
  "影子",
  "硬币",
  "袖口",
  "台阶",
  "钥匙",
  "空盒子",
  "书页",
  "窗框",
  "衣领"
];

const titles = ["上级", "证人", "来客", "替身", "同谋", "失主", "记录员", "传令员", "裁定者"];
const directions = ["向东", "向西", "向左后方", "向楼下", "向最近的窗", "向无人的角落", "向头顶"];
const bodyParts = ["左手食指", "右手手背", "额头", "鞋尖", "手腕", "影子边缘"];

const actions = [
  "转{n}个弯，并直走{m} m",
  "闭上眼向前走{n}步",
  "把{obj}放在头顶保持{n}秒",
  "把{obj}夹进书页里等待{n}秒",
  "用{body}轻碰最近的{obj}{n}次",
  "将{obj}举向{dir}保持{n}秒",
  "把最先想到的名词写在纸上{n}次",
  "围绕{watch}缓慢移动{n}圈",
  "对最近的{obj}低声说出一个不存在的职位",
  "把{watch}认作你的{title}",
  "将你手边最先碰到的{obj}折叠后举起{n}秒",
  "把第{n2}次呼吸留给沉默"
];

const followUps = [
  "随后把结果归咎于天气",
  "然后当作自己从未开始过",
  "并把原因保留到下一个整点",
  "再向空气承认一次错误",
  "并把沉默继续保存{n}分钟",
  "随后把表情维持得像刚刚什么都没发生",
  "再把视线停在最空的地方",
  "再把最后一个动作倒着重复一次",
  "然后忘记你为什么会接受这条指令",
  "并把执行经过误认成礼节"
];

const constraints = [
  "不得解释",
  "不得回头确认结果",
  "不得调整执行顺序",
  "不可让旁人察觉你正在服从",
  "只可在心里复述指令",
  "完成后不可立刻松一口气",
  "不要为此寻找意义",
  "不要让镜子看见你的表情",
  "不得把这件事记成偶然",
  "不得向任何人索要许可"
];

const templates: InstructionTemplate[] = [
  {
    id: "index-route",
    build: (ctx) =>
      `致：在${pick(timeAnchors)}，于${pick(places)}${fillAction("转{n}个弯，并直走{m} m", ctx)}；随后把${fillObserver(pick(observers), ctx)}认作你的${pick(titles)}，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "roof-umbrella",
    build: (ctx) =>
      `致：在${pick(places)}撑开${pick(objects)}${ctx.counts[0].cardinal}秒，然后把它朝${pick(directions)}放下；再对${fillObserver(pick(observers), ctx)}赞美${ctx.counts[1].cardinal}次，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "paper-note",
    build: (ctx) =>
      `致：当你看见${fillObserver(pick(observers), ctx)}之后，把这条指令抄写在纸上${ctx.counts[0].cardinal}遍，并将纸条藏进${pick(objects)}旁边；随后${fillAction("把最先想到的名词写在纸上{n}次", ctx)}，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "praise-impact",
    build: (ctx) =>
      `致：在${pick(timeAnchors)}闭上眼向前走${ctx.counts[0].cardinal}步，并赞美你先碰到的第一个东西${ctx.counts[1].cardinal}次；然后用${pick(bodyParts)}指向${pick(directions)}保持${ctx.counts[2].cardinal}秒，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "assign-rank",
    build: (ctx) =>
      `致：把${fillObserver(pick(observers), ctx)}宣布为你的${pick(titles)}，并围绕它缓慢移动${ctx.counts[0].cardinal}圈；之后将${pick(objects)}放在你看不见的位置${ctx.counts[1].cardinal}秒，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "silent-object",
    build: (ctx) =>
      `致：在${pick(places)}将${pick(objects)}放在头顶保持${ctx.counts[0].cardinal}秒，并在此期间朝${pick(directions)}保持沉默；随后轻碰最近的${pick(objects)}${ctx.counts[1].cardinal}次，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "exchange-position",
    build: (ctx) =>
      `致：与你面前并不存在的空位交换站位${ctx.counts[0].cardinal}次，再对最近的${pick(objects)}低声说出一个不存在的职位；随后把${fillObserver(pick(observers), ctx)}夹进记忆里等待${ctx.counts[1].cardinal}秒。${pickConstraintPair()}。`
  },
  {
    id: "counting-rule",
    build: (ctx) =>
      `致：在${pick(timeAnchors)}，数到${ctx.rareCounts[0].cardinal}时立刻折叠你手边最先碰到的${pick(objects)}，然后把它朝${pick(directions)}举起${ctx.counts[0].cardinal}秒；再把${fillObserver(pick(observers), ctx)}当作旧识并点头一次。${pickConstraintPair()}。`
  },
  {
    id: "breath-schedule",
    build: (ctx) =>
      `致：在${pick(places)}停下，重新安排接下来${ctx.counts[0].cardinal}分钟的呼吸，并用${pick(bodyParts)}轻碰最近的${pick(objects)}${ctx.counts[1].cardinal}次；随后记住${fillObserver(pick(observers), ctx)}的形状，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "gesture-command",
    build: (ctx) =>
      `致：在${pick(timeAnchors)}前，向${pick(directions)}举起${pick(objects)}并保持${ctx.counts[0].cardinal}秒；然后把${fillObserver(pick(observers), ctx)}误认成你的${pick(titles)}，再把最后一个动作倒着重复${ctx.counts[1].cardinal}次。${pickConstraintPair()}。`
  },
  {
    id: "found-object",
    build: (ctx) =>
      `致：找到${fillObserver(pick(observers), ctx)}，并确保它在${ctx.counts[0].cardinal}分钟内成为你唯一允许注视的对象；随后把${pick(objects)}放到${pick(places)}，${fillFollowUp(ctx)}。${pickConstraintPair()}。`
  },
  {
    id: "ritual-loop",
    build: (ctx) =>
      `致：在${pick(places)}重复一个看似无关紧要的动作${ctx.rareCounts[0].cardinal}次，并在第${ctx.counts[0].ordinal}次时停顿${ctx.counts[1].cardinal}秒；然后记住${fillObserver(pick(observers), ctx)}，却不要承认你记住了它。${pickConstraintPair()}。`
  }
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toHan(value: number): string {
  if (value < 10) return hanDigits[value];
  if (value < 20) return value === 10 ? "十" : `十${hanDigits[value % 10]}`;
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const units = value % 10;
    return units === 0 ? `${hanDigits[tens]}十` : `${hanDigits[tens]}十${hanDigits[units]}`;
  }
  return String(value);
}

function makeCount(min: number, max: number): RandomCountToken {
  const value = randomInt(min, max);
  return {
    value,
    cardinal: Math.random() > 0.5 ? String(value) : toHan(value),
    ordinal: Math.random() > 0.5 ? String(value) : toHan(value)
  };
}

function buildContext(): InstructionContext {
  return {
    counts: [makeCount(2, 17), makeCount(3, 15), makeCount(2, 12)],
    rareCounts: [makeCount(18, 90), makeCount(20, 150)]
  };
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function fillObserver(template: string, ctx: InstructionContext): string {
  return template
    .replaceAll("{n}", ctx.counts[0].ordinal)
    .replaceAll("{n2}", ctx.counts[1].ordinal);
}

function fillAction(template: string, ctx: InstructionContext): string {
  return template
    .replaceAll("{n}", ctx.counts[0].cardinal)
    .replaceAll("{n2}", ctx.counts[1].ordinal)
    .replaceAll("{m}", String(ctx.rareCounts[0].value))
    .replaceAll("{obj}", pick(objects))
    .replaceAll("{body}", pick(bodyParts))
    .replaceAll("{dir}", pick(directions))
    .replaceAll("{title}", pick(titles))
    .replaceAll("{watch}", fillObserver(pick(observers), ctx));
}

function fillFollowUp(ctx: InstructionContext): string {
  return pick(followUps)
    .replaceAll("{n}", ctx.counts[0].cardinal)
    .replaceAll("{n2}", ctx.counts[1].ordinal);
}

function pickConstraintPair(): string {
  const first = pick(constraints);
  let second = pick(constraints);
  while (second === first) second = pick(constraints);
  return `${first}，${second}`;
}

export function buildInstructionEntry(): InstructionEntry {
  const context = buildContext();
  const template = pick(templates);
  return {
    primary: template.build(context),
    iconAsset: instructionAsset,
    meta: { templateId: template.id }
  };
}

const scrambleChars = "致月食指命令站台纸条路口影子门把手按钮台阶ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

export function scrambleTo(node: HTMLElement | null, text: string, speed = 20): Promise<void> {
  if (!node) return Promise.resolve();

  activeScrambleToken += 1;
  const token = activeScrambleToken;

  return new Promise((resolve) => {
    let frame = 0;
    const total = text.length * 2 + 12;

    const timer = window.setInterval(() => {
      if (token !== activeScrambleToken) {
        window.clearInterval(timer);
        resolve();
        return;
      }

      const output = text
        .split("")
        .map((char, index) => {
          if ([" ", "，", "。", "；", "："].includes(char)) return char;
          const unlockFrame = /\d|m|s/i.test(char) ? index * 1.25 : index * 2;
          if (frame >= unlockFrame) return char;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("");

      node.textContent = output;
      frame += 1;

      if (frame >= total) {
        window.clearInterval(timer);
        node.textContent = text;
        resolve();
      }
    }, speed);
  });
}
