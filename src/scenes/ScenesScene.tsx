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
  durationInFrames: 308
}

export const TIMES = [
  {
    clock: '06:00',
    label: '早安',
    icon: ICONS.sun as IconDefinition,
    color: COLORS.gold,
    line: '早、早啊，笨蛋哥哥……今天有好好吃早饭吗？',
    delay: 20
  },
  {
    clock: '12:00',
    label: '午安',
    icon: ICONS.cloudSun as IconDefinition,
    color: COLORS.pink,
    line: '午安，哥哥！吃饱了吗？陪我聊会儿吧～',
    delay: 55
  },
  {
    clock: '20:00',
    label: '夜幕',
    icon: ICONS.moon as IconDefinition,
    color: COLORS.purple,
    line: '夜幕降临啦，今天也辛苦了！和我聊聊吧～',
    delay: 90
  },
  {
    clock: '22:00',
    label: '晚安',
    icon: ICONS.moon as IconDefinition,
    color: COLORS.blue,
    line: '晚安，笨蛋哥哥……才不是舍不得你呢！',
    delay: 125
  }
]

export const TimeNode: React.FC<{
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
        zIndex: 2,
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

/** 时间轴卡片，可嵌入全天陪伴段，展示一天中的关键问候。 */
export const DayTimeline: React.FC<{ title?: string; showTitle?: boolean }> = ({
  title = '从早到晚，她都在',
  showTitle = true
}) => {
  const frame = useCurrentFrame()
  const railP = interpolate(frame, [10, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <>
      {showTitle ? (
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
            color: COLORS.textDark,
            zIndex: 2
          }}
        >
          <Icon icon={ICONS.clock} size={26} color={COLORS.purple} />
          {title}
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 216,
          top: 248,
          width: 6,
          height: 530,
          borderRadius: 999,
          background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.pink}, ${COLORS.purple}, ${COLORS.blue})`,
          zIndex: 2,
          opacity: railP * 0.35
        }}
      />
      {TIMES.map((t, i) => (
        <TimeNode key={i} {...t} y={215 + i * 130} />
      ))}
    </>
  )
}

export const ScenesScene: React.FC = () => {
  const frame = useCurrentFrame()
  const railP = interpolate(frame, [10, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
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
