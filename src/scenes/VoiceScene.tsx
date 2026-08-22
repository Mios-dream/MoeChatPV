import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { RoundedCard, SceneTitle } from '../ui'
import { Icon, ICONS } from '../icons'

const WaveBars: React.FC<{ bars?: number; color?: string; speed?: number }> = ({
  bars = 26,
  color = COLORS.pink,
  speed = 0.3
}) => {
  const frame = useCurrentFrame()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        height: 90
      }}
    >
      {Array.from({ length: bars }, (_, i) => {
        const v =
          Math.abs(Math.sin(i * 0.55 + frame * 0.16 * speed)) * 0.6 +
          Math.abs(Math.sin(i * 0.23 + frame * 0.09 * speed)) * 0.4
        return (
          <div
            key={i}
            style={{
              width: 9,
              height: 12 + v * 70,
              borderRadius: 5,
              background: color,
              opacity: 0.75 + v * 0.25
            }}
          />
        )
      })}
    </div>
  )
}

const MoodChip: React.FC<{
  icon: React.ReactNode
  label: string
  index: number
}> = ({ icon, label, index }) => {
  const frame = useCurrentFrame()
  const cycle = (frame * 0.12 + index) % 3
  const active = cycle < 1
  const p = usePop(frame, 120 + index * 14)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '13px 22px',
        borderRadius: 999,
        background: active
          ? `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkDark})`
          : 'rgba(255,255,255,0.9)',
        border: `2px solid ${active ? 'transparent' : COLORS.pinkPale}`,
        color: active ? COLORS.white : COLORS.textDark,
        fontFamily: FONT.sanJi,
        fontSize: 23,
        fontWeight: 700,
        boxShadow: active ? `0 10px 24px -8px ${COLORS.pinkShadow}` : 'none',
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`
      }}
    >
      {icon}
      {label}
    </div>
  )
}

export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame()
  const recText = usePop(frame, 130)
  const ttsText = usePop(frame, 170)
  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#fff1f6" to="#ffd9e6" sparkleSeed={77} />
      <SceneTitle
        delay={10}
        sub="识别 → 理解 → 回应，一气呵成"
        icon={<Icon icon={ICONS.micLines} size={54} color={COLORS.pinkDark} />}
      >
        能听会说的智能语音
      </SceneTitle>

      <div
        style={{
          position: 'absolute',
          top: 300,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 40
        }}
      >
        <RoundedCard width={470} height={480} delay={40} pad={30}>
          <Icon
            icon={ICONS.micLines}
            size={64}
            color={COLORS.pinkDark}
            style={{ marginBottom: 8 }}
          />
          <div
            style={{
              fontFamily: FONT.kaTong,
              fontSize: 36,
              color: COLORS.pinkDark,
              marginBottom: 14
            }}
          >
            实时语音识别
          </div>
          <WaveBars bars={22} />
          <div
            style={{
              marginTop: 18,
              fontSize: 27,
              fontFamily: FONT.sanJi,
              color: COLORS.textDark,
              background: '#fff0f5',
              padding: '12px 20px',
              borderRadius: 16,
              opacity: recText,
              transform: `translateY(${(1 - recText) * 16}px)`
            }}
          >
            “今天想吃火锅…”
            <span style={{ color: COLORS.pinkDark, fontWeight: 700 }}>
              <Icon icon={ICONS.check} size={22} color={COLORS.mint} /> 已识别
            </span>
          </div>
        </RoundedCard>

        <RoundedCard width={470} height={480} delay={70} pad={30}>
          <Icon icon={ICONS.volume} size={64} color={COLORS.purple} style={{ marginBottom: 8 }} />
          <div
            style={{
              fontFamily: FONT.kaTong,
              fontSize: 36,
              color: COLORS.pinkDark,
              marginBottom: 14
            }}
          >
            自然语音合成
          </div>
          <WaveBars bars={22} color={COLORS.purple} speed={0.45} />
          <div
            style={{
              marginTop: 18,
              fontSize: 27,
              fontFamily: FONT.sanJi,
              color: COLORS.textDark,
              background: '#f3edff',
              padding: '12px 20px',
              borderRadius: 16,
              opacity: ttsText,
              transform: `translateY(${(1 - ttsText) * 16}px)`
            }}
          >
            <Icon icon={ICONS.volume} size={24} color={COLORS.purple} /> 澪酱：
            <strong style={{ color: COLORS.purple }}>“好呀，晚上就吃火锅～”</strong>
          </div>
        </RoundedCard>

        <RoundedCard width={470} height={480} delay={100} pad={30}>
          <Icon icon={ICONS.masks} size={64} color={COLORS.pinkDark} style={{ marginBottom: 8 }} />
          <div
            style={{
              fontFamily: FONT.kaTong,
              fontSize: 36,
              color: COLORS.pinkDark,
              marginBottom: 18
            }}
          >
            表情动作自动生成
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              alignItems: 'center'
            }}
          >
            <MoodChip
              icon={<Icon icon={ICONS.smile} size={28} color={COLORS.pinkDark} />}
              label="开心"
              index={0}
            />
            <MoodChip
              icon={<Icon icon={ICONS.flushed} size={28} color={COLORS.pinkDark} />}
              label="害羞"
              index={1}
            />
            <MoodChip
              icon={<Icon icon={ICONS.frown} size={28} color={COLORS.pinkDark} />}
              label="委屈"
              index={2}
            />
            <MoodChip
              icon={<Icon icon={ICONS.bolt} size={28} color={COLORS.pinkDark} />}
              label="元气"
              index={3}
            />
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 22,
              color: COLORS.textGray,
              fontFamily: FONT.sanJi
            }}
          >
            对话内容驱动 Live2D 表情动作
          </div>
        </RoundedCard>
      </div>
    </AbsoluteFill>
  )
}
