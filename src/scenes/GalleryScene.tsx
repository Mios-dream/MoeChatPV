import React from 'react'
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { Video } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { usePop } from '../fx'
import { WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'
import { UPPER_BODY_ZOOM } from '../live2d/characterFraming'

// 由 scripts/create-live2d-asset.mjs 生成的素材，时长以 source.json 为准。
export const DIARY_ASSET = {
  name: 'diary-secret',
  durationInFrames: 278
}
export const DIARY_SCENE_EXIT = 30
export const DIARY_SCENE_DURATION = DIARY_ASSET.durationInFrames + DIARY_SCENE_EXIT
const CHARACTER_ENTRY_DELAY = 16

export const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame()
  const titleP = usePop(frame, 8)
  const diaryP = usePop(frame, 24, 38)
  const sceneExitP = interpolate(
    frame,
    [DIARY_SCENE_DURATION - DIARY_SCENE_EXIT, DIARY_SCENE_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const sceneContentP = 1 - sceneExitP

  return (
    <AbsoluteFill>
      {/* 标题样式与其他流程一致。 */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: titleP * sceneContentP,
        }}
      >
        <Icon icon={ICONS.book} size={40} color={COLORS.gold} />
        <div
          style={{
            fontFamily: FONT.kaTong,
            fontSize: 50,
            color: COLORS.pinkDark,
            letterSpacing: 2,
            textShadow: `0 6px 24px ${COLORS.pinkShadow}`
          }}
        >
          日记分享
        </div>
      </div>

      {/* 只保留日记内容。 */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 200,
          zIndex: 2,
          opacity: diaryP * sceneContentP,
        }}
      >
        <WindowFrame width={960} height={640} title="助手日记" popDelay={26}>
          <Video
            src={staticFile('video/clips/diary.mp4')}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </WindowFrame>
      </div>

      {/* 智乃本尊：向右为日记内容留出完整阅读空间。 */}
      <CharacterClip
        name={DIARY_ASSET.name}
        durationInFrames={DIARY_ASSET.durationInFrames}
        start={CHARACTER_ENTRY_DELAY}
        voiceVolume={0.96}
        zoom={UPPER_BODY_ZOOM}
        fadeIn={18}
        fadeOut={18}
        holdUntil={DIARY_SCENE_DURATION - CHARACTER_ENTRY_DELAY}
        style={{
          left: 550,
          top: 0,
          width: 1100,
          height: 1100,
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  )
}
