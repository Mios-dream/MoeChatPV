import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { StripedStage, usePop } from '../fx'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'

// 由 scripts/create-live2d-asset.mjs 生成（--sleep），时长以 source.json 为准。
export const SLEEP_ASSET = {
  name: 'sleep-mode',
  durationInFrames: 527
}

const Meter: React.FC<{
  label: string
  icon: React.ReactNode
  value: number
  displayValue: string
  color: string
  delay: number
}> = ({ label, icon, value, displayValue, color, delay }) => {
  const frame = useCurrentFrame()
  const p = usePop(frame, delay)
  const w = interpolate(frame, [delay + 16, delay + 44], [0, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  return (
    <div style={{ width: '100%', opacity: p }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: FONT.sanJi,
          fontSize: 20,
          color: COLORS.textDark,
          fontWeight: 700,
          marginBottom: 6
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          {label}
        </span>
        <span style={{ color }}>{displayValue}</span>
      </div>
      <div style={{ height: 12, borderRadius: 999, background: '#e6f4ff', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${w}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}88, ${color})`
          }}
        />
      </div>
    </div>
  )
}

export const SleepScene: React.FC = () => {
  const frame = useCurrentFrame()
  const zP = interpolate(frame, [80, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <AbsoluteFill>
      <StripedStage />

      {/* 场景内的小标签：睡眠模式。 */}
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
        <Icon icon={ICONS.moon} size={26} color={COLORS.purple} />
        睡眠模式
      </div>

      {/* 月光 + 睡意氛围，陪在她身边。 */}
      <div
        style={{
          position: 'absolute',
          left: 220,
          top: 240,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(183,140,232,0.22) 0%, rgba(183,140,232,0) 70%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 270,
          top: 300,
          fontFamily: FONT.kaTong,
          fontSize: 64,
          color: COLORS.purple,
          opacity: zP,
          transform: `translateY(${(1 - zP) * 20}px)`,
          letterSpacing: 8
        }}
      >
        z Z
      </div>

      {/* 低占用数据退到角落：睡眠模式 = 她安静地休息。 */}
      <div
        style={{
          position: 'absolute',
          left: 820,
          bottom: 200,
          width: 440,
          padding: '24px 30px',
          borderRadius: 26,
          background: 'rgba(255,255,255,0.95)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 18px 44px -16px ${COLORS.pinkShadow}`
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
            marginBottom: 16
          }}
        >
          <Icon icon={ICONS.battery} size={28} color={COLORS.mint} />
          低占用模式
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Meter
            label="内存"
            icon={<Icon icon={ICONS.brain} size={20} color={COLORS.blue} />}
            value={11}
            displayValue="1.1 GB"
            color={COLORS.blue}
            delay={60}
          />
          <Meter
            label="CPU"
            icon={<Icon icon={ICONS.bolt} size={20} color={COLORS.mint} />}
            value={10}
            displayValue="约 10%"
            color={COLORS.mint}
            delay={82}
          />
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: FONT.sanJi,
            fontSize: 18,
            color: COLORS.textGray,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Icon icon={ICONS.brain} size={18} color={COLORS.purple} />
          R7 7735H 实测 · 睡眠时自动收起部分模型
        </div>
      </div>

      {/* 智乃本尊：闭眼小憩，被叫到时半睁着眼回答。 */}
      <CharacterClip
        name={SLEEP_ASSET.name}
        durationInFrames={SLEEP_ASSET.durationInFrames}
        voiceVolume={0.96}
        style={{
          right: -300,
          top: -100,
          width: 1320,
          height: 1320
        }}
      />
    </AbsoluteFill>
  )
}
