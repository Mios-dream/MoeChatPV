import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { usePop } from '../fx'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'
import { UPPER_BODY_ZOOM } from '../live2d/characterFraming'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// 日常交互段只展示摸摸头回应；天气和睡眠分别在后续专属板块呈现。
// 素材由 scripts/create-live2d-asset.mjs 生成，时长以 source.json 为准。
const REPLY_FADE = 18
const SCENE_EXIT = 30

export const CHAT_REPLIES = [
  {
    category: '摸摸头',
    categoryIcon: ICONS.listCheck as IconDefinition,
    asset: 'chat-reply-1',
    durationInFrames: 221,
    start: 10
  }
]

export const CHAT_SCENE_DURATION =
  CHAT_REPLIES[CHAT_REPLIES.length - 1].start +
  CHAT_REPLIES[CHAT_REPLIES.length - 1].durationInFrames +
  36

const replyEnterProgress = (
  frame: number,
  start: number,
  fade = 10
): number => {
  return interpolate(frame, [start, start + fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
}

export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame()
  const titleP = usePop(frame, 6)
  const cardP = usePop(frame, 26)
  const sceneExitP = interpolate(
    frame,
    [CHAT_SCENE_DURATION - SCENE_EXIT, CHAT_SCENE_DURATION],
    [0, 1],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )
  const sceneContentP = 1 - sceneExitP
  const activeReply = CHAT_REPLIES[0]
  const labelP =
    Math.min(cardP, replyEnterProgress(frame, activeReply.start, REPLY_FADE)) * sceneContentP

  return (
    <AbsoluteFill>
      {/* 左上角标题：与其他功能段保持一致。 */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 72,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
          opacity: titleP * sceneContentP,
        }}
      >
        <Icon icon={ICONS.comments} size={40} color={COLORS.gold} />
        <div
          style={{
            fontFamily: FONT.kaTong,
            fontSize: 50,
            color: COLORS.pinkDark,
            letterSpacing: 2,
            textShadow: `0 6px 24px ${COLORS.pinkShadow}`
          }}
        >
          日常交互
        </div>
      </div>

      {/* 左侧：当前交互类别。 */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 400,
          minWidth: 272,
          minHeight: 88,
          padding: '20px 34px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.94)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 18px 44px -16px ${COLORS.pinkShadow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: labelP,
        }}
      >
        {CHAT_REPLIES.map((r, i) => {
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: 1
              }}
            >
              <Icon icon={r.categoryIcon} size={34} color={COLORS.pinkDark} />
              <div
                style={{
                  fontFamily: FONT.kaTong,
                  fontSize: 38,
                  color: COLORS.pinkDark,
                  whiteSpace: 'nowrap'
                }}
              >
                {r.category}
              </div>
            </div>
          )
        })}
      </div>

      {/* 角色头部特写：画面中心，逐条回应，展示表情与口型。 */}
      {CHAT_REPLIES.map((r, i) => (
        <CharacterClip
          key={r.asset}
          name={r.asset}
          durationInFrames={r.durationInFrames}
          start={r.start}
          holdUntil={CHAT_SCENE_DURATION - r.start}
          voiceVolume={0.96}
          zoom={UPPER_BODY_ZOOM}
          fadeIn={REPLY_FADE}
          fadeOut={REPLY_FADE}
          style={{
            left: 250,
            top: 0,
            width: 1100,
            height: 1100
          }}
        />
      ))}
    </AbsoluteFill>
  )
}
