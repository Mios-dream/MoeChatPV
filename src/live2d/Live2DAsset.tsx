import React from 'react'
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { GeneratedMotion, Live2DStage } from './Live2DStage'
import { Audio } from '@remotion/media'

export type Live2DAssetProps = {
  durationInFrames: number
  audioPath?: string
  motion?: GeneratedMotion
  mouthCues?: number[]
  background?: 'transparent' | 'chroma'
}

export const LIVE2D_ASSET_DEFAULT_PROPS: Live2DAssetProps = {
  durationInFrames: 600,
  background: 'transparent'
}

export const Live2DAsset: React.FC<Live2DAssetProps> = ({
  audioPath,
  motion,
  mouthCues,
  background = 'transparent'
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  return (
    <AbsoluteFill style={{ background: background === 'chroma' ? '#00ff00' : 'transparent' }}>
      <Live2DStage
        width={width}
        height={height}
        targetTime={frame / fps}
        motion={motion}
        mouthCues={mouthCues}
      />
      {audioPath ? <Audio src={staticFile(audioPath)} /> : null}
    </AbsoluteFill>
  )
}
