import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { Mascot } from '../mascot'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// 由 scripts/create-live2d-asset.mjs 生成的素材，时长以 source.json 为准。
export const HOME_ASSET = {
  name: 'come-home',
  durationInFrames: 278,
  start: 185
}

const STEPS = [
  { icon: ICONS.download, title: '来接她吧', desc: '下载整合包，一键搞定' },
  { icon: ICONS.folder, title: '给她安个家', desc: '解压到本地，免安装' },
  { icon: ICONS.rocket, title: '她住进桌面', desc: '打开 MoeChat，Windows / Linux 都行' },
  { icon: ICONS.handSparkles, title: '初次见面～', desc: '你好呀，阁下，我等你好久啦', mascot: true }
]

export const InstallScene: React.FC = () => {
  const frame = useCurrentFrame()
  const phaseP = interpolate(frame, [HOME_ASSET.start + 5, HOME_ASSET.start + 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const meetP = usePop(frame, 260)
  const noteP = usePop(frame, 320)

  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#ffedf4" to="#ffd5e2" sparkleSeed={13} petals />

      {/* 第一步：接她的四个步骤。她登场后，步骤轻轻让位。 */}
      <div
        style={{
          position: 'absolute',
          top: 330 - phaseP * 90,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0,
          opacity: 1 - phaseP * 0.45,
          transform: `scale(${1 - phaseP * 0.06})`
        }}
      >
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <StepCard {...s} index={i} delay={40 + i * 50} />
            {i < STEPS.length - 1 ? <Arrow delay={90 + i * 50} /> : null}
          </React.Fragment>
        ))}
      </div>

      {/* 第二步：她登场，和阁下打招呼。 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 370,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          opacity: meetP
        }}
      >
        <Mascot size={190} delay={245} mood="happy" />
        <div
          style={{
            padding: '22px 34px',
            borderRadius: 28,
            background: 'rgba(255,255,255,0.95)',
            border: `2.5px solid ${COLORS.pinkPale}`,
            boxShadow: `0 20px 50px -18px ${COLORS.pinkShadow}`,
            fontFamily: FONT.kaTong,
            fontSize: 46,
            color: COLORS.pinkDark
          }}
        >
          欢迎回家，阁下！
        </div>
      </div>

      {/* 开源信息：保留，但安静地待在角落。 */}
      <div
        style={{
          position: 'absolute',
          bottom: 190,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            opacity: noteP,
            transform: `translateY(${(1 - noteP) * 18}px)`,
            padding: '16px 32px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            border: `2px solid ${COLORS.pinkPale}`,
            boxShadow: `0 14px 34px -14px ${COLORS.pinkShadow}`,
            fontFamily: FONT.sanJi,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.textDark
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon icon={ICONS.code} size={24} color={COLORS.pinkDark} />
            从源码构建：
          </span>
          <code
            style={{
              background: '#ffeaf2',
              color: COLORS.pinkDark,
              padding: '6px 16px',
              borderRadius: 10,
              fontSize: 20
            }}
          >
            git clone → npm install → npm run dev
          </code>
          <span style={{ color: COLORS.textGray, fontSize: 20 }}>免费 · 开源 · GPL</span>
        </div>
      </div>

      {/* 智乃本尊：把我也带回家吧。 */}
      <CharacterClip
        name={HOME_ASSET.name}
        durationInFrames={HOME_ASSET.durationInFrames}
        start={HOME_ASSET.start}
        voiceVolume={0.96}
        style={{
          right: -280,
          top: -120,
          width: 1300,
          height: 1300,
          opacity: phaseP
        }}
      />
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
        width: 340,
        height: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 28,
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
          top: 16,
          left: 20,
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkDark})`,
          color: COLORS.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.kaTong,
          fontSize: 26,
          boxShadow: `0 8px 18px -6px ${COLORS.pinkShadow}`
        }}
      >
        {index + 1}
      </div>
      {mascot ? (
        <Img
          src={staticFile('images/mascot.png')}
          style={{
            width: 84,
            height: 84,
            objectFit: 'contain',
            filter: `drop-shadow(0 8px 16px ${COLORS.pinkShadow})`
          }}
        />
      ) : (
        <Icon icon={icon} size={58} color={COLORS.pinkDark} />
      )}
      <div style={{ fontFamily: FONT.kaTong, fontSize: 32, color: COLORS.pinkDark }}>{title}</div>
      <div
        style={{
          fontFamily: FONT.sanJi,
          fontSize: 21,
          color: COLORS.textGray,
          textAlign: 'center',
          padding: '0 22px',
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
  const p = interpolate(frame, [delay, delay + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const dashOffset = 24 - p * 24
  return (
    <div
      style={{
        width: 60,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p
      }}
    >
      <svg width={60} height={36} viewBox="0 0 60 36">
        <line
          x1={4}
          y1={18}
          x2={48}
          y2={18}
          stroke={COLORS.pink}
          strokeWidth={4}
          strokeDasharray="8 8"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
        <path
          d="M46,8 L58,18 L46,28"
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
