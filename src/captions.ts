import { COLORS } from "./theme";

export type Caption = {
  start: number;
  end: number;
  speaker: string;
  text: string;
  color?: string;
};

// Frames at 30fps. Scenes overlap by 15-frame transitions.
export const CAPTIONS: Caption[] = [
  {
    start: 447,
    end: 565,
    speaker: "智乃",
    text: "欢迎回来，阁下，今天也要一起加油哦！",
  },
  {
    start: 575,
    end: 710,
    speaker: "智乃",
    text: "想聊天、查天气，还是记下今天的心情？告诉我吧",
  },
  {
    start: 1030,
    end: 1280,
    speaker: "旁白",
    text: "实时语音识别与合成，表情动作自动生成，越聊越懂你",
  },
  {
    start: 1340,
    end: 1595,
    speaker: "智乃",
    text: "早安问候、深夜吐槽、节日祝福，专属助手空间等你来定制",
  },
  {
    start: 1700,
    end: 1955,
    speaker: "旁白",
    text: "小组件随叫随到：待办、天气、便签……桌面不再单调",
  },
  {
    start: 1985,
    end: 2120,
    speaker: "旁白",
    text: "低占用模式加持，摸鱼追番也不卡",
  },
  {
    start: 2165,
    end: 2345,
    speaker: "智乃",
    text: "日记、主页、服务状态一目了然，功能持续进化中",
  },
  {
    start: 2390,
    end: 2825,
    speaker: "旁白",
    text: "三步带走智乃：下载 → 解压 → 打开，就能开始聊天",
  },
  {
    start: 2870,
    end: 3224,
    speaker: "智乃",
    text: "你的桌面，从此不再孤单 —— 现在就把智乃带回家吧！",
    color: COLORS.pinkDark,
  },
];
