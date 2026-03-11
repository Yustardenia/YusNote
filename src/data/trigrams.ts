export interface Trigram {
  name: string;
  symbol: string;
  keyword: string;
  element: string;
  action: string;
}

export const trigrams: Record<string, Trigram> = {
  "111": { name: "乾", symbol: "☰", keyword: "主动", element: "天", action: "适合正面推进，先立方向，再给出明确行动。" },
  "000": { name: "坤", symbol: "☷", keyword: "承载", element: "地", action: "适合整理资源、打底结构，先稳住节奏再扩张。" },
  "001": { name: "震", symbol: "☳", keyword: "起动", element: "雷", action: "适合先迈出第一步，别让犹豫比困难更大。" },
  "010": { name: "坎", symbol: "☵", keyword: "穿越", element: "水", action: "有阻力但可通行，重点是保持连续动作，不要半途断档。" },
  "011": { name: "艮", symbol: "☶", keyword: "止定", element: "山", action: "适合踩刹车、做边界和取舍，把不必要的事情先停掉。" },
  "100": { name: "巽", symbol: "☴", keyword: "渗透", element: "风", action: "适合慢慢推进、做沟通和协调，不要只靠硬冲。" },
  "101": { name: "离", symbol: "☲", keyword: "显化", element: "火", action: "适合展示、汇报、整理可见成果，把信息说清楚。" },
  "110": { name: "兑", symbol: "☱", keyword: "交流", element: "泽", action: "适合协作、反馈和调试，通过互动来修正方向。" }
};
