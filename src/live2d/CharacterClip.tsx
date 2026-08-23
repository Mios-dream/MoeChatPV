import React from 'react'
import { Audio, Sequence, staticFile } from 'remotion'
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
  zoom
}) => {
  const scale = zoom?.scale ?? 1
  const focusX = zoom?.focusX ?? 0.5
  const focusY = zoom?.focusY ?? 0.5
  return (
    <Sequence from={start} durationInFrames={durationInFrames} premountFor={12}>
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          ...style
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <Video
            src={staticFile(`live2d-generated/${name}/character.webm`)}
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
      </div>
      <Sequence from={voiceStart}>
        <Audio src={staticFile(`live2d-generated/${name}/voice.wav`)} volume={voiceVolume} />
      </Sequence>
    </Sequence>
  )
}
