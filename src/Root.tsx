import React from "react";
import { Composition } from "remotion";
import { MoeChatPV, SCENE_DURATIONS, TRANSITION } from "./MoeChatPV";
import { Live2DAsset, LIVE2D_ASSET_DEFAULT_PROPS } from "./live2d/Live2DAsset";
import "./fonts";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MoeChatPV"
        component={MoeChatPV}
        // TransitionSeries 会让每个转场重叠 TRANSITION 帧。
        durationInFrames={
          Object.values(SCENE_DURATIONS).reduce((total, duration) => total + duration, 0) -
          TRANSITION * (Object.keys(SCENE_DURATIONS).length - 1)
        }
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Live2DAsset"
        component={Live2DAsset}
        defaultProps={LIVE2D_ASSET_DEFAULT_PROPS}
        durationInFrames={600}
        fps={30}
        width={3840}
        height={3840}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(1, Math.floor(props.durationInFrames)),
        })}
      />
    </>
  );
};
