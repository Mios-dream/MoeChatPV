import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { RotatingFlower, StripedStage, usePop } from '../fx'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// 三条风格化回复，按顺序轮播；左侧情景卡跟随当前回复切换。
// 素材由 scripts/create-live2d-asset.mjs 生成，时长以 source.json 为准。
export const CHAT_REPLIES = [
  {
    category: '待办提醒',
    categoryIcon: ICONS.listCheck as IconDefinition,
    asset: 'chat-reply-1',
    durationInFrames: 221,
    start: 10
  },
  {
    category: '天气提醒',
    categoryIcon: ICONS.cloudSun as IconDefinition,
    asset: 'chat-reply-2',
    durationInFrames: 220,
    start: 240
  },
  {
    category: '深夜陪伴',
    categoryIcon: ICONS.moon as IconDefinition,
    asset: 'chat-reply-3',
    durationInFrames: 242,
    start: 469
  }
]

export const CHAT_SCENE_DURATION =
  CHAT_REPLIES[CHAT_REPLIES.length - 1].start +
  CHAT_REPLIES[CHAT_REPLIES.length - 1].durationInFrames +
  36

const HEAD_ZOOM = { scale: 2.0, focusX: 0.5, focusY: 0.27 }

export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame()
  const titleP = usePop(frame, 6)
  let active = 0
  for (let i = 0; i < CHAT_REPLIES.length; i++) {
    const r = CHAT_REPLIES[i]
    if (frame >= r.start && frame < r.start + r.durationInFrames) {
      active = i
      break
    }
  }
  const scenarioP = usePop(frame, CHAT_REPLIES[active].start + 6)
  const cardP = usePop(frame, 26)

  return (
    <AbsoluteFill>
      <StripedStage />

      {/* 左上角标题：与「她住进桌面以后」同款设计。 */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 72,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
          opacity: titleP
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
          聊天展示
        </div>
      </div>

      {/* 左侧：当前类别的标签，一次只展示一条。 */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 400,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '20px 34px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.94)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 18px 44px -16px ${COLORS.pinkShadow}`,
          opacity: cardP,
          transform: `scale(${0.86 + 0.14 * cardP})`
        }}
      >
        <Icon icon={CHAT_REPLIES[active].categoryIcon} size={34} color={COLORS.pinkDark} />
        <div
          style={{
            fontFamily: FONT.kaTong,
            fontSize: 38,
            color: COLORS.pinkDark,
            opacity: scenarioP,
            transform: `translateY(${(1 - scenarioP) * 16}px)`
          }}
        >
          {CHAT_REPLIES[active].category}
        </div>
      </div>

      {/* 与前面环节一致的旋转花朵点缀。 */}
      <RotatingFlower left={170} top={210} size={118} opacity={0.58} offset={12} />
      <RotatingFlower left={1780} top={230} size={84} opacity={0.5} offset={72} />
      <RotatingFlower left={180} top={880} size={78} opacity={0.48} offset={210} />
      <RotatingFlower left={1740} top={860} size={142} opacity={0.56} offset={148} />

      {/* 角色头部特写：画面中心，逐条回应，展示表情与口型。 */}
      <div
        style={{
          position: 'absolute',
          left: 660,
          top: 150,
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          // background: 'radial-gradient(circle, rgba(255,214,228,0.55) 0%, rgba(255,214,228,0) 68%)',
          pointerEvents: 'none'
        }}
      />
      {CHAT_REPLIES.map((r, i) => (
        <CharacterClip
          key={r.asset}
          name={r.asset}
          durationInFrames={r.durationInFrames}
          start={r.start}
          voiceVolume={0.96}
          zoom={HEAD_ZOOM}
          style={{
            left: 250,
            top: -100,
            width: 1100,
            height: 1100
          }}
        />
      ))}
    </AbsoluteFill>
  )
}
