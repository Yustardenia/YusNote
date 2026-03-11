export interface LinkCard {
  href: string;
  kicker: string;
  title: string;
  copy: string;
  footer: string;
}

export const toolCards: LinkCard[] = [
  {
    href: "./tools/todo.html",
    kicker: "任务",
    title: "Todo 清单",
    copy: "快速记录今天要做的事，支持一键同步到首页倒计时。",
    footer: "进入清单"
  },
  {
    href: "./tools/schedule.html",
    kicker: "节奏",
    title: "时间安排",
    copy: "按日期组织日程，查看当天事项的开始、结束与当前状态。",
    footer: "安排今天"
  },
  {
    href: "./tools/kanban.html",
    kicker: "流转",
    title: "看板",
    copy: "拖拽管理 backlog、进行中与已完成，适合拆分一整周的行动。",
    footer: "打开看板"
  },
  {
    href: "./tools/focus.html",
    kicker: "专注",
    title: "Pomodoro",
    copy: "本地 Pomodoro 计时器，保留每日统计和完成记录。",
    footer: "开始专注"
  },
  {
    href: "./tools/creative.html",
    kicker: "创作",
    title: "Creative Studio",
    copy: "整合 Markdown 草稿、白板涂鸦和 Mermaid 流程图。",
    footer: "进入工作台"
  },
  {
    href: "./tools/compare.html",
    kicker: "文件",
    title: "目录比对",
    copy: "纯前端比较两个目录，生成用于清理重复文件的 PowerShell 命令。",
    footer: "比较目录"
  },
  {
    href: "./tools/rename.html",
    kicker: "整理",
    title: "批量重命名",
    copy: "浏览器内重命名文件并导出 ZIP，不依赖本地脚本。",
    footer: "开始整理"
  },
  {
    href: "./tools/keyword.html",
    kicker: "互动",
    title: "年度关键词",
    copy: "输入名字得到稳定的关键词卡片，适合截图分享。",
    footer: "试试看"
  },
  {
    href: "./tools/divination.html",
    kicker: "趣味",
    title: "金钱卦",
    copy: "模拟六次掷钱，生成卦象、动爻和当下的行动建议。",
    footer: "起一卦"
  },
  {
    href: "./tools/game.html",
    kicker: "放松",
    title: "Cyber Dash",
    copy: "轻量浏览器小游戏，保留最高分记录，给工作台一点喘息感。",
    footer: "开始游戏"
  }
];

export const docCards: LinkCard[] = [
  {
    href: "./docs/guide.html",
    kicker: "手册",
    title: "Yus 开发总览",
    copy: "整理原始 Unity/Yus 主教程，梳理模块、建议目录和开发流程。",
    footer: "阅读总览"
  },
  {
    href: "./docs/unity-ui.html",
    kicker: "UI",
    title: "Unity UI 体系",
    copy: "聚焦 UI 架构、数据绑定和组件协作的整理版说明。",
    footer: "查看 UI 文档"
  },
  {
    href: "./docs/audio-system.html",
    kicker: "Audio",
    title: "全局音频系统",
    copy: "归纳音乐、音效、总线和淡入淡出的实现思路。",
    footer: "阅读音频文档"
  },
  {
    href: "./docs/will-of-the-city.html",
    kicker: "Showcase",
    title: "Will of the City",
    copy: "保留原项目气质的展示页，记录视觉方向和交互氛围。",
    footer: "进入展示"
  }
];
