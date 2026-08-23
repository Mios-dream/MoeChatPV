import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { StripedStage, usePop } from '../fx'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// 由 scripts/create-live2d-asset.mjs 生成的素材，时长以 source.json 为准。
export const WIDGET_ASSET = {
  name: 'widget-weather',
  durationInFrames: 365
}

const WIDGETS = [
  {
    icon: ICONS.clock as IconDefinition,
    label: '时钟日历',
    content: '14:30 · 周六',
    color: COLORS.gold,
    delay: 40
  },
  {
    icon: ICONS.cloudSun as IconDefinition,
    label: '天气',
    content: '多云 24°',
    color: COLORS.blue,
    delay: 70
  },
  {
    icon: ICONS.quote as IconDefinition,
    label: '每日一句',
    content: '今天也要元气满满',
    color: COLORS.pinkDark,
    delay: 100
  },
  {
    icon: ICONS.listCheck as IconDefinition,
    label: '任务板',
    content: '15:00 · 和朋友吃火锅',
    color: COLORS.mint,
    delay: 130
  },
  {
    icon: ICONS.noteSticky as IconDefinition,
    label: '便签',
    content: '出门记得带伞',
    color: COLORS.purple,
    delay: 160
  }
]

const WidgetCard: React.FC<{
  icon: IconDefinition
  label: string
  content: string
  color: string
  delay: number
}> = ({ icon, label, content, color, delay }) => {
  const frame = useCurrentFrame()
  const p = usePop(frame, delay)
  const bob = Math.sin(frame * 0.04 + delay) * 6
  return (
    <div
      style={{
        width: 270,
        height: 178,
        padding: '20px 24px',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.95)',
        border: `2px solid ${COLORS.pinkPale}`,
        boxShadow: `0 18px 40px -16px ${COLORS.pinkShadow}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        opacity: p,
        transform: `translateY(${bob + (1 - p) * 26}px) scale(${0.82 + 0.18 * p})`
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: FONT.sanJi,
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.textGray
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon icon={icon} size={22} color={color} />
        </div>
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT.kaTong,
          fontSize: 30,
          color: COLORS.textDark,
          marginTop: 'auto'
        }}
      >
        {content}
      </div>
    </div>
  )
}

export const WidgetShowcase: React.FC = () => {
  const frame = useCurrentFrame()
  const titleP = usePop(frame, 8)

  return (
    <AbsoluteFill>
      <StripedStage />

      {/* 章节标签：她住进桌面以后。 */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 82,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: titleP
        }}
      >
        <Icon icon={ICONS.wand} size={38} color={COLORS.gold} />
        <div
          style={{
            fontFamily: FONT.kaTong,
            fontSize: 48,
            color: COLORS.pinkDark,
            letterSpacing: 2,
            textShadow: `0 6px 24px ${COLORS.pinkShadow}`
          }}
        >
          她住进桌面以后
        </div>
      </div>

      {/* 桌面上的小组件：一组小摆件，随取随用。 */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 220,
          width: 940,
          height: 470,
          padding: 34,
          borderRadius: 34,
          background: 'rgba(255,255,255,0.62)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 24px 60px -22px ${COLORS.pinkShadow}`
        }}
      >
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {WIDGETS.map((w, i) => (
            <WidgetCard key={i} {...w} />
          ))}
        </div>
      </div>

      {/* 智乃本尊：她的日常回复，刚好对应桌面上的小组件。 */}
      <CharacterClip
        name={WIDGET_ASSET.name}
        durationInFrames={WIDGET_ASSET.durationInFrames}
        voiceVolume={0.96}
        style={{
          right: -300,
          top: -90,
          width: 1300,
          height: 1300
        }}
      />
    </AbsoluteFill>
  )
}
