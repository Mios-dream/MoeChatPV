import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT } from "./theme";

loadFont({
  family: FONT.kaTong,
  url: staticFile("fonts/KaTong.ttf"),
  weight: "400",
});
loadFont({
  family: FONT.sanJi,
  url: staticFile("fonts/SanJiYuanTi.ttf"),
  weight: "400",
});
loadFont({
  family: FONT.loli,
  url: staticFile("fonts/Loli.ttf"),
  weight: "400",
});
