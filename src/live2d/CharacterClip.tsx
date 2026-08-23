import React from 'react'
import { Sequence, staticFile, interpolate, useCurrentFrame } from 'remotion'
import { Audio } from '@remotion/media'
import { Video } from '@remotion/media'

/**
 * 播放一条由 create-live2d-asset.mjs 生成的透明角色素材：
 * character.webm 只含画面（静音），voice.wav 单独挂载，保证音画同步。
 */
export const CharacterClip: React.FC<{
  name: string
  durationInFrames: number
  start?: number
  voiceStart?: number
  voiceVolume?: number
  style?: React.CSSProperties
  fadeIn?: number
  fadeOut?: number
  zoom?: {
    scale: number
    focusX?: number
    focusY?: number
  }
}> = ({
  name,
  durationInFrames,
  start = 0,
  voiceStart = 0,
  voiceVolume = 1,
  style,
  fadeIn = 0,
  fadeOut = 0,
  zoom
}) => {
  const scale = zoom?.scale ?? 1
  const focusX = zoom?.focusX ?? 0.5
  const focusY = zoom?.focusY ?? 0.5
  // `useCurrentFrame()` is relative to the parent timeline here. Convert it to
  // the clip's own timeline before applying its fade ranges.
  const frame = useCurrentFrame() - start
  // Studio 预览使用轻量代理素材（character-preview.webm），
  // CLI 渲染导出使用 4K 主素材（character.webm），保证预览流畅且导出清晰。
  const isStudio =
    typeof window !== 'undefined' &&
    (window as unknown as { remotion_isStudio?: boolean }).remotion_isStudio === true
  const videoFile = isStudio ? 'character-preview.webm' : 'character.webm'
  const fadeInP =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })
      : 1
  const fadeOutP =
    fadeOut > 0
      ? interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })
      : 1
  return (
    <Sequence from={start} durationInFrames={durationInFrames} premountFor={12}>
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: Math.min(fadeInP, fadeOutP),
          ...style
        }}
      >
        <Video
          src={staticFile(`live2d-generated/${name}/${videoFile}`)}
          muted
          style={{
            position: 'absolute',
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            left: `calc(50% - ${focusX * scale * 100}%)`,
            top: `calc(50% - ${focusY * scale * 100}%)`,
            objectFit: 'contain'
          }}
        />
      </div>
      <Sequence from={voiceStart}>
        <Audio src={staticFile(`live2d-generated/${name}/voice.wav`)} volume={voiceVolume} />
      </Sequence>
    </Sequence>
  )
}
