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

export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame()
  const recText = usePop(frame, 130)
  const ttsText = usePop(frame, 170)
  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#fff1f6" to="#ffd9e6" sparkleSeed={77} />
      <SceneTitle
        delay={10}
        sub="你开口，她把这件事接过去"
        icon={<Icon icon={ICONS.micLines} size={54} color={COLORS.pinkDark} />}
      >
        一句话，智乃就记住了
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
            你说，她听见
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
            “周六下午三点，提醒我吃火锅。”
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
            她回你一句
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
            <Icon icon={ICONS.volume} size={24} color={COLORS.purple} /> 智乃：
            <strong style={{ color: COLORS.purple }}>“记好啦，到时间叫你～”</strong>
          </div>
        </RoundedCard>

        <RoundedCard width={470} height={480} delay={100} pad={30}>
          <Icon icon={ICONS.listCheck} size={64} color={COLORS.pinkDark} style={{ marginBottom: 8 }} />
          <div
            style={{
              fontFamily: FONT.kaTong,
              fontSize: 36,
              color: COLORS.pinkDark,
              marginBottom: 18
            }}
          >
            然后，她替你记下
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              padding: '18px 20px',
              borderRadius: 16,
              background: '#fff0f5',
              gap: 12,
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: FONT.sanJi,
                fontSize: 22,
                color: COLORS.textGray
              }}
            >
              <span>周六</span>
              <span>15:00</span>
            </div>
            <div
              style={{
                fontFamily: FONT.sanJi,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.textDark
              }}
            >
              和朋友吃火锅
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: FONT.sanJi,
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.mint
              }}
            >
              <Icon icon={ICONS.check} size={22} color={COLORS.mint} /> 已加入待办
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 22,
              color: COLORS.textGray,
              fontFamily: FONT.sanJi
            }}
          >
            <Icon icon={ICONS.smile} size={24} color={COLORS.pinkDark} /> 她笑着点点头
          </div>
        </RoundedCard>
      </div>
    </AbsoluteFill>
  )
}
