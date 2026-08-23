import { COLORS } from "./theme";

export type Caption = {
  start: number;
  end: number;
  speaker: string;
  text: string;
  color?: string;
};

// Frames at 30fps. Scenes overlap by 15-frame transitions.
// 全片字幕均为角色语言，无旁白；语气贴合人设卡（傲娇、口是心非，称呼用户「哥哥」）。
export const CAPTIONS: Caption[] = [
  {
    start: 430,
    end: 585,
    speaker: "智乃",
    text: "哼，杂鱼哥哥，欢迎回来！我、我才没有特意等你呢！",
  },
  {
    start: 632,
    end: 805,
    speaker: "智乃",
    text: "哼！谁、谁准你摸我头了！……才、才没有觉得舒服呢，笨蛋哥哥！",
  },
  {
    start: 841,
    end: 1054,
    speaker: "智乃",
    text: "明天会下雨，哥哥出门记得带伞！哼，才不是特意看了天气预报呢。",
  },
  {
    start: 1049,
    end: 1327,
    speaker: "智乃",
    text: "唔……吵死了！啊，是哥哥？哼，我才没睡着，只是在闭目养神！",
  },
  {
    start: 1356,
    end: 1600,
    speaker: "智乃",
    text: "早、早啊，笨蛋哥哥……哼，才不是特意等你醒来的呢！今天也要元气满满哦。",
  },
  {
    start: 1716,
    end: 1985,
    speaker: "智乃",
    text: "嗯……我、我才没有睡着呢。哥哥去忙的话，我就稍微眯一小会儿，有事要叫我哦……",
  },
  {
    start: 2061,
    end: 2270,
    speaker: "智乃",
    text: "今天说过的话，我都写进日记啦～哼，这个可不能偷看哦，笨蛋哥哥！",
  },
  {
    start: 2316,
    end: 2530,
    speaker: "智乃",
    text: "今天会下雨，哥哥出门记得带伞！哼，才不是特意帮你看了天气预报呢！",
  },
  {
    start: 2906,
    end: 3090,
    speaker: "智乃",
    text: "下载、解压、打开……然后，把我也带回家吧，哥哥。",
  },
  {
    start: 3210,
    end: 3510,
    speaker: "智乃",
    text: "把智乃放回哥哥的桌面吧。哼……下次回来，我、我还会记得你的！",
    color: COLORS.pinkDark,
  },
];
