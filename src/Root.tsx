import React from "react";
import { Composition } from "remotion";
import { MoeChatPV } from "./MoeChatPV";
import { Live2DAsset, LIVE2D_ASSET_DEFAULT_PROPS } from "./live2d/Live2DAsset";
import "./fonts";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MoeChatPV"
        component={MoeChatPV}
        durationInFrames={3255}
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
        width={1024}
        height={1024}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(1, Math.floor(props.durationInFrames)),
        })}
      />
    </>
  );
};
