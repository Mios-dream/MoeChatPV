import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowsRotate,
  faArrowsUpDownLeftRight,
  faBatteryQuarter,
  faBolt,
  faBookOpen,
  faBrain,
  faCat,
  faCircleCheck,
  faClock,
  faCloudSun,
  faCode,
  faComments,
  faDove,
  faDownload,
  faEye,
  faFaceFlushed,
  faFaceFrownOpen,
  faFaceGrinStars,
  faFaceSmile,
  faFeather,
  faFolderOpen,
  faGhost,
  faGift,
  faHandSparkles,
  faHeart,
  faHeartPulse,
  faHouse,
  faLaptop,
  faListCheck,
  faMasksTheater,
  faMicrophone,
  faMicrophoneLines,
  faMoon,
  faNoteSticky,
  faPalette,
  faPaw,
  faQuoteLeft,
  faRocket,
  faStar,
  faSun,
  faTerminal,
  faThumbsUp,
  faToolbox,
  faVideo,
  faVolumeHigh,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

export const ICONS = {
  arrowsRotate: faArrowsRotate,
  drag: faArrowsUpDownLeftRight,
  battery: faBatteryQuarter,
  bolt: faBolt,
  book: faBookOpen,
  brain: faBrain,
  cat: faCat,
  check: faCircleCheck,
  clock: faClock,
  cloudSun: faCloudSun,
  code: faCode,
  comments: faComments,
  dove: faDove,
  download: faDownload,
  eye: faEye,
  flushed: faFaceFlushed,
  frown: faFaceFrownOpen,
  grinStars: faFaceGrinStars,
  smile: faFaceSmile,
  feather: faFeather,
  folder: faFolderOpen,
  ghost: faGhost,
  gift: faGift,
  handSparkles: faHandSparkles,
  heart: faHeart,
  heartPulse: faHeartPulse,
  house: faHouse,
  laptop: faLaptop,
  listCheck: faListCheck,
  masks: faMasksTheater,
  mic: faMicrophone,
  micLines: faMicrophoneLines,
  moon: faMoon,
  noteSticky: faNoteSticky,
  palette: faPalette,
  paw: faPaw,
  quote: faQuoteLeft,
  rocket: faRocket,
  star: faStar,
  sun: faSun,
  terminal: faTerminal,
  thumbsUp: faThumbsUp,
  toolbox: faToolbox,
  video: faVideo,
  volume: faVolumeHigh,
  wand: faWandMagicSparkles,
};

export const Icon: React.FC<{
  icon: IconDefinition;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ icon, size = 24, color, style }) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      style={{ fontSize: size, color, lineHeight: 1, ...style }}
    />
  );
};
