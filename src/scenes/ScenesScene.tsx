import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { StripedStage, usePop } from '../fx'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// 由 scripts/create-live2d-asset.mjs 生成的素材，时长以 source.json 为准。
export const DAY_ASSET = {
  name: 'day-companion',
  durationInFrames: 278
}

const TIMES = [
  {
    clock: '06:00',
    label: '早安',
    icon: ICONS.sun as IconDefinition,
    color: COLORS.gold,
    line: '早上好呀，今天也要元气满满！',
    delay: 20
  },
  {
    clock: '12:00',
    label: '白天',
    icon: ICONS.cloudSun as IconDefinition,
    color: COLORS.pink,
    line: '想聊什么，我都听着呢～',
    delay: 55
  },
  {
    clock: '23:00',
    label: '深夜',
    icon: ICONS.moon as IconDefinition,
    color: COLORS.purple,
    line: '吐槽大会，现在开始！',
    delay: 90
  },
  {
    clock: '24:00',
    label: '晚安',
    icon: ICONS.star as IconDefinition,
    color: COLORS.blue,
    line: '晚安，阁下，明天见。',
    delay: 125
  }
]

const ASSISTANTS = [
  { icon: ICONS.paw, name: '元气小鹿', color: '#ffb3c6' },
  { icon: ICONS.dove, name: '温柔兔兔', color: '#c9a7f5' },
  { icon: ICONS.cat, name: '毒舌猫猫', color: '#8fc8f0' }
]

const TimeNode: React.FC<{
  clock: string
  label: string
  icon: IconDefinition
  color: string
  line: string
  delay: number
  y: number
}> = ({ clock, label, icon, color, line, delay, y }) => {
  const frame = useCurrentFrame()
  const p = usePop(frame, delay)
  return (
    <div
      style={{
        position: 'absolute',
        left: 150,
        top: y,
        width: 620,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`
      }}
    >
      <div
        style={{
          width: 86,
          height: 86,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 12px 26px -10px ${color}`,
          border: `4px solid ${COLORS.white}`,
          flexShrink: 0
        }}
      >
        <Icon icon={icon} size={40} color={COLORS.white} />
      </div>
      <div
        style={{
          flex: 1,
          padding: '18px 24px',
          borderRadius: 22,
          background: 'rgba(255,255,255,0.94)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 14px 34px -14px ${COLORS.pinkShadow}`
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: FONT.kaTong,
            fontSize: 30,
            color: COLORS.pinkDark,
            marginBottom: 6
          }}
        >
          <span>{label}</span>
          <span
            style={{
              fontFamily: FONT.sanJi,
              fontSize: 20,
              fontWeight: 700,
              color,
              background: `${color}22`,
              padding: '3px 12px',
              borderRadius: 999
            }}
          >
            {clock}
          </span>
        </div>
        <div
          style={{
            fontFamily: FONT.sanJi,
            fontSize: 25,
            color: COLORS.textDark,
            fontWeight: 600
          }}
        >
          {line}
        </div>
      </div>
    </div>
  )
}

export const ScenesScene: React.FC = () => {
  const frame = useCurrentFrame()
  const railP = interpolate(frame, [10, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const roomP = usePop(frame, 215)

  return (
    <AbsoluteFill>
      <StripedStage />

      {/* 场景内的小标签：一整天的时间流。 */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 96,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 10px 24px -10px ${COLORS.pinkShadow}`,
          fontFamily: FONT.sanJi,
          fontSize: 24,
          fontWeight: 700,
          color: COLORS.textDark
        }}
      >
        <Icon icon={ICONS.clock} size={26} color={COLORS.purple} />
        从早到晚，她都在
      </div>

      {/* 时间轴线：随着她的陪伴一路走到晚安。 */}
      <div
        style={{
          position: 'absolute',
          left: 216,
          top: 248,
          width: 6,
          height: 530,
          borderRadius: 999,
          background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.pink}, ${COLORS.purple}, ${COLORS.blue})`,
          opacity: railP * 0.35
        }}
      />
      {TIMES.map((t, i) => (
        <TimeNode key={i} {...t} y={215 + i * 130} />
      ))}

      {/* 助手空间：她的朋友们也可以换着陪伴阁下。 */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 18,
          opacity: roomP
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
          <Icon icon={ICONS.house} size={24} color={COLORS.pinkDark} />
          助手空间
        </div>
        {ASSISTANTS.map((a, i) => {
          const p = usePop(frame, 235 + i * 18)
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 20px',
                borderRadius: 999,
                background: '#fffafc',
                border: `2px solid ${a.color}`,
                fontFamily: FONT.sanJi,
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.textDark,
                opacity: p,
                transform: `translateY(${(1 - p) * 18}px)`
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: a.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon icon={a.icon} size={20} color={COLORS.white} />
              </div>
              {a.name}
            </div>
          )
        })}
      </div>

      {/* 智乃本尊：陪着你从早到晚。 */}
      <CharacterClip
        name={DAY_ASSET.name}
        durationInFrames={DAY_ASSET.durationInFrames}
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
