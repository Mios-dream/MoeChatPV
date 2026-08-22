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
    text: "你说周六的火锅，智乃替你记下；她回一句，表情也跟着亮起来。",
  },
  {
    start: 1340,
    end: 1595,
    speaker: "智乃",
    text: "从早安到晚安，智乃会在属于她的位置上，接住你的每一句话。",
  },
  {
    start: 1700,
    end: 1955,
    speaker: "旁白",
    text: "天气、待办、便签，不用翻窗口；叫一声，桌边就有回应。",
  },
  {
    start: 1985,
    end: 2120,
    speaker: "旁白",
    text: "在 R7 7735H 上，CPU 约 10%，内存约 1.1 GB；她在运行，风扇不用加班。",
  },
  {
    start: 2165,
    end: 2345,
    speaker: "智乃",
    text: "今天说过的话，会在日记里留下位置；主页和服务状态，也都清清楚楚。",
  },
  {
    start: 2390,
    end: 2825,
    speaker: "旁白",
    text: "下载，解压，打开。智乃就在桌面上，等你先说一句你好。",
  },
  {
    start: 2870,
    end: 3224,
    speaker: "智乃",
    text: "把智乃放回你的桌面吧。下一次回来，她还会记得你。",
    color: COLORS.pinkDark,
  },
];
