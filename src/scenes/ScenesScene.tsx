import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { RoundedCard, SceneTitle, Screenshot } from '../ui'
import { Icon, ICONS } from '../icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const SCENARIOS = [
  {
    icon: ICONS.sun as IconDefinition,
    title: '早安问候',
    text: '早上好呀，今天也要元气满满！',
    color: COLORS.gold
  },
  {
    icon: ICONS.moon as IconDefinition,
    title: '深夜吐槽',
    text: '吐槽大会现在开始～',
    color: COLORS.purple
  },
  {
    icon: ICONS.gift as IconDefinition,
    title: '节日祝福',
    text: '节日快乐，智乃的祝福请查收！',
    color: COLORS.pinkDark
  },
  {
    icon: ICONS.heart as IconDefinition,
    title: '日常陪伴',
    text: '我在呢，一直都在。',
    color: COLORS.pink
  }
]

const ASSISTANTS = [
  { icon: ICONS.paw, name: '元气小鹿', color: '#ffb3c6' },
  { icon: ICONS.dove, name: '温柔兔兔', color: '#c9a7f5' },
  { icon: ICONS.cat, name: '毒舌猫猫', color: '#8fc8f0' }
]

export const ScenesScene: React.FC = () => {
  const frame = useCurrentFrame()
  const panelP = usePop(frame, 210)
  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#fff0f6" to="#ffd8e5" sparkleSeed={9} />
      <SceneTitle
        delay={8}
        sub="早安、吐槽、祝福，换个时间也认得你"
        icon={<Icon icon={ICONS.moon} size={54} color={COLORS.purple} />}
      >
        从早安到晚安，她一直在这儿
      </SceneTitle>

      <div
        style={{
          position: 'absolute',
          top: 295,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 28
        }}
      >
        {SCENARIOS.map((s, i) => (
          <ScenarioCard key={i} {...s} delay={30 + i * 26} />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 140,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <RoundedCard width={1500} delay={200} accent={COLORS.pinkPale} pad={28}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 34,
              width: '100%'
            }}
          >
            <div
              style={{
                width: 400,
                height: 245,
                borderRadius: 18,
                overflow: 'hidden',
                background: '#fff',
                border: `2px solid ${COLORS.pinkPale}`,
                opacity: panelP,
                transform: `scale(${0.9 + 0.1 * panelP})`
              }}
            >
              <Screenshot src="images/assistant-space.png" delay={215} float={false} />
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 16
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: FONT.kaTong,
                  fontSize: 38,
                  color: COLORS.pinkDark,
                  opacity: panelP
                }}
              >
                <Icon icon={ICONS.house} size={40} color={COLORS.pinkDark} />
                助手空间 —— 一人一位专属助手
              </div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                {ASSISTANTS.map((a, i) => {
                  const p = usePop(frame, 230 + i * 20)
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 22px',
                        borderRadius: 999,
                        background: '#fffafc',
                        border: `2px solid ${a.color}`,
                        opacity: p,
                        transform: `translateY(${(1 - p) * 20}px)`
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: a.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon icon={a.icon} size={26} color={COLORS.white} />
                      </div>
                      <div
                        style={{
                          fontFamily: FONT.sanJi,
                          fontSize: 25,
                          fontWeight: 700,
                          color: COLORS.textDark
                        }}
                      >
                        {a.name}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: FONT.sanJi,
                  fontSize: 23,
                  color: COLORS.textGray,
                  opacity: panelP
                }}
              >
                <Icon icon={ICONS.wand} size={22} color={COLORS.pink} />
                性格 · 声音 · 动作，全部可以自定义
              </div>
            </div>
          </div>
        </RoundedCard>
      </div>
    </AbsoluteFill>
  )
}

const ScenarioCard: React.FC<{
  icon: IconDefinition
  title: string
  text: string
  color: string
  delay: number
}> = ({ icon, title, text, color, delay }) => {
  const frame = useCurrentFrame()
  const p = usePop(frame, delay)
  return (
    <RoundedCard width={310} height={290} delay={delay} pad={22}>
      <Icon icon={icon} size={58} color={color} style={{ marginBottom: 10 }} />
      <div
        style={{
          fontFamily: FONT.kaTong,
          fontSize: 34,
          color: COLORS.pinkDark,
          marginBottom: 10
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: FONT.sanJi,
          fontSize: 21,
          color: COLORS.textGray,
          textAlign: 'center',
          lineHeight: 1.55
        }}
      >
        {text}
      </div>
    </RoundedCard>
  )
}
