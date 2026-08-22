import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { SceneTitle } from '../ui'
import { Icon, ICONS } from '../icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const STEPS = [
  { icon: ICONS.download, title: '下载整合包', desc: '一键下载完整版' },
  { icon: ICONS.folder, title: '解压到本地', desc: '免安装，即开即用' },
  { icon: ICONS.rocket, title: '打开 MoeChat', desc: 'Windows / Linux 都支持' },
  { icon: ICONS.handSparkles, title: '和智乃打招呼！', desc: '你好呀，初次见面～', mascot: true }
]

export const InstallScene: React.FC = () => {
  const frame = useCurrentFrame()
  const noteP = usePop(frame, 330)
  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#ffedf4" to="#ffd5e2" sparkleSeed={13} />
      <SceneTitle
        delay={8}
        sub="从下载到开聊，三步搞定"
        icon={<Icon icon={ICONS.rocket} size={54} color={COLORS.pinkDark} />}
      >
        下载以后，马上开聊
      </SceneTitle>

      <div
        style={{
          position: 'absolute',
          top: 340,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0
        }}
      >
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <StepCard {...s} index={i} delay={40 + i * 55} />
            {i < STEPS.length - 1 ? <Arrow delay={90 + i * 55} /> : null}
          </React.Fragment>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 150,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            opacity: noteP,
            transform: `translateY(${(1 - noteP) * 22}px)`,
            padding: '20px 40px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.94)',
            border: `2px solid ${COLORS.pinkPale}`,
            boxShadow: `0 16px 40px -16px ${COLORS.pinkShadow}`,
            fontFamily: FONT.sanJi,
            fontSize: 27,
            fontWeight: 700,
            color: COLORS.textDark
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon icon={ICONS.code} size={28} color={COLORS.pinkDark} />
            从源码构建：
          </span>
          <code
            style={{
              background: '#ffeaf2',
              color: COLORS.pinkDark,
              padding: '8px 20px',
              borderRadius: 12,
              fontSize: 24
            }}
          >
            git clone → npm install → npm run dev
          </code>
          <span style={{ color: COLORS.textGray, fontSize: 22 }}>免费 · 开源 · GPL</span>
        </div>
      </div>
    </AbsoluteFill>
  )
}

const StepCard: React.FC<{
  icon: IconDefinition
  title: string
  desc: string
  index: number
  delay: number
  mascot?: boolean
}> = ({ icon, title, desc, index, delay, mascot }) => {
  const frame = useCurrentFrame()
  const p = usePop(frame, delay)
  return (
    <div
      style={{
        width: 380,
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 30,
        background: 'rgba(255,255,255,0.94)',
        border: `2.5px solid ${COLORS.pinkPale}`,
        boxShadow: `0 20px 50px -18px ${COLORS.pinkShadow}`,
        opacity: p,
        transform: `scale(${0.8 + 0.2 * p}) rotate(${(1 - p) * -2}deg)`,
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 22,
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkDark})`,
          color: COLORS.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.kaTong,
          fontSize: 28,
          boxShadow: `0 8px 18px -6px ${COLORS.pinkShadow}`
        }}
      >
        {index + 1}
      </div>
      {mascot ? (
        <Img
          src={staticFile('images/mascot.png')}
          style={{
            width: 92,
            height: 92,
            objectFit: 'contain',
            filter: `drop-shadow(0 8px 16px ${COLORS.pinkShadow})`
          }}
        />
      ) : (
        <Icon icon={icon} size={64} color={COLORS.pinkDark} />
      )}
      <div
        style={{
          fontFamily: FONT.kaTong,
          fontSize: 34,
          color: COLORS.pinkDark
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: FONT.sanJi,
          fontSize: 22,
          color: COLORS.textGray,
          textAlign: 'center',
          padding: '0 24px',
          lineHeight: 1.5
        }}
      >
        {desc}
      </div>
    </div>
  )
}

const Arrow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [delay, delay + 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const dashOffset = 24 - p * 24
  return (
    <div
      style={{
        width: 72,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p
      }}
    >
      <svg width={72} height={40} viewBox="0 0 72 40">
        <line
          x1={4}
          y1={20}
          x2={58}
          y2={20}
          stroke={COLORS.pink}
          strokeWidth={4}
          strokeDasharray="8 8"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
        <path
          d="M56,10 L70,20 L56,30"
          fill="none"
          stroke={COLORS.pinkDark}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
