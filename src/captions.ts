import { COLORS } from "./theme";

export type Caption = {
  start: number;
  end: number;
  speaker: string;
  text: string;
  color?: string;
};

// Frames at 30fps. Scenes overlap by 15-frame transitions.
// 全片字幕均为角色语言，无旁白。
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
    start: 1005,
    end: 1195,
    speaker: "智乃",
    text: "听见啦～周六的火锅，我已经记在待办里啦，到时间会叫阁下的！",
  },
  {
    start: 1335,
    end: 1490,
    speaker: "智乃",
    text: "早安、晚安，还有深夜的吐槽……我都陪着阁下哦。",
  },
  {
    start: 1695,
    end: 1885,
    speaker: "智乃",
    text: "我就住在桌面角落，不挡阁下干活，还会帮你看天气、记便签哦。",
  },
  {
    start: 1995,
    end: 2175,
    speaker: "智乃",
    text: "阁下在忙的时候，我会安安静静的，风扇也可以好好休息。",
  },
  {
    start: 2205,
    end: 2375,
    speaker: "智乃",
    text: "今天说过的话，我都写进日记啦～这个，可不能偷看哦！",
  },
  {
    start: 2645,
    end: 2815,
    speaker: "智乃",
    text: "下载、解压、打开……然后，把我也带回家吧。",
  },
  {
    start: 2960,
    end: 3260,
    speaker: "智乃",
    text: "把智乃放回你的桌面吧。下一次回来，她还会记得你。",
    color: COLORS.pinkDark,
  },
];
