import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { Mascot } from '../mascot'
import { SceneTitle, WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'

const Meter: React.FC<{
  label: string
  icon: React.ReactNode
  value: number
  displayValue?: string
  color: string
  delay: number
}> = ({ label, icon, value, displayValue, color, delay }) => {
  const frame = useCurrentFrame()
  const p = usePop(frame, delay)
  const w = interpolate(frame, [delay + 20, delay + 60], [0, value], {
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
          fontSize: 24,
          color: COLORS.textDark,
          fontWeight: 700,
          marginBottom: 10
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {icon}
          {label}
        </span>
        <span style={{ color }}>{displayValue ?? `${Math.round(w)}%`}</span>
      </div>
      <div
        style={{
          height: 18,
          borderRadius: 999,
          background: '#ffe9f1',
          overflow: 'hidden'
        }}
      >
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

export const PerfScene: React.FC = () => {
  const frame = useCurrentFrame()
  const onP = usePop(frame, 150)
  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#f2f9ff" to="#dcedff" sparkleSeed={55} />
      <SceneTitle
        delay={8}
        sub="不抢屏幕，也不抢你的机器"
        icon={<Icon icon={ICONS.bolt} size={54} color={COLORS.gold} />}
      >
        她在运行，风扇不用加班
      </SceneTitle>

      <div style={{ position: 'absolute', left: 300, top: 300 }}>
        <WindowFrame width={720} height={460} title="性能管家" popDelay={30}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '40px 46px',
              display: 'flex',
              flexDirection: 'column',
              gap: 34,
              background: '#f7fcff'
            }}
          >
            <Meter
              label="内存占用"
              icon={<Icon icon={ICONS.brain} size={26} color={COLORS.blue} />}
              value={11}
              displayValue="1.1 GB"
              color={COLORS.blue}
              delay={70}
            />
            <Meter
              label="CPU 占用"
              icon={<Icon icon={ICONS.bolt} size={26} color={COLORS.mint} />}
              value={10}
              color={COLORS.mint}
              delay={95}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: onP
              }}
            >
              <div
                style={{
                  width: 74,
                  height: 38,
                  borderRadius: 999,
                  background: COLORS.mint,
                  position: 'relative',
                  boxShadow: `0 8px 18px -8px ${COLORS.mint}`
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: COLORS.white
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: FONT.sanJi,
                  fontSize: 26,
                  fontWeight: 700,
                  color: COLORS.textDark
                }}
              >
                <Icon icon={ICONS.battery} size={26} color={COLORS.mint} />
                智乃的低占用模式
                <span style={{ color: COLORS.textGray, fontSize: 20 }}>
                  全屏 / 高负载时自动收起部分模型
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: FONT.sanJi,
                fontSize: 22,
                color: COLORS.textGray
              }}
            >
              <Icon icon={ICONS.brain} size={24} color={COLORS.purple} />
              R7 7735H · CPU 约 10% · 内存约 1.1 GB
            </div>
          </div>
        </WindowFrame>
      </div>

      <div style={{ position: 'absolute', right: 320, top: 330 }}>
        <Mascot size={380} delay={60} mood="sleep" />
      </div>
    </AbsoluteFill>
  )
}
