import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { Mascot } from '../mascot'
import { FeatureChip, PopText } from '../ui'
import { Icon, ICONS } from '../icons'

export const Outro: React.FC = () => {
  const frame = useCurrentFrame()
  const cardP = usePop(frame, 140)
  const chipsP = usePop(frame, 185)
  const biliP = usePop(frame, 225)
  const fadeOut = interpolate(frame, [380, 415], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#ffe7f0" to="#ffcfe0" sparkleSeed={23} />

      <div
        style={{
          position: 'absolute',
          top: 150,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <PopText
          text="把智乃放回你的桌面吧！"
          delay={45}
          fontSize={104}
          color={COLORS.pinkDark}
          gap={4}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 330,
          transform: 'translateX(-50%)'
        }}
      >
        <Mascot size={200} delay={70} mood="happy" />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 545,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '24px 44px',
            borderRadius: 28,
            background: 'rgba(255,255,255,0.95)',
            border: `2.5px solid ${COLORS.pinkPale}`,
            boxShadow: `0 24px 60px -20px ${COLORS.pinkShadow}`,
            opacity: cardP,
            transform: `scale(${0.85 + 0.15 * cardP})`
          }}
        >
          <Icon icon={ICONS.star} size={52} color={COLORS.gold} />
          <div>
            <div
              style={{
                fontFamily: FONT.kaTong,
                fontSize: 36,
                color: COLORS.pinkDark
              }}
            >
              MoeChat-APP
            </div>
            <div
              style={{
                fontFamily: FONT.sanJi,
                fontSize: 24,
                color: COLORS.textGray
              }}
            >
              github.com/Mios-dream/MoeChat-APP
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 18,
            opacity: chipsP,
            transform: `translateY(${(1 - chipsP) * 20}px)`
          }}
        >
          <FeatureChip
            label="免费"
            icon={<Icon icon={ICONS.gift} size={24} color={COLORS.pink} />}
            delay={185}
            size={22}
          />
          <FeatureChip
            label="开源"
            icon={<Icon icon={ICONS.code} size={24} color={COLORS.pink} />}
            delay={205}
            size={22}
          />
          <FeatureChip
            label="持续更新"
            icon={<Icon icon={ICONS.arrowsRotate} size={24} color={COLORS.pink} />}
            delay={225}
            size={22}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: FONT.sanJi,
            fontSize: 26,
            color: COLORS.textGray,
            fontWeight: 600,
            opacity: biliP,
            transform: `translateY(${(1 - biliP) * 18}px)`
          }}
        >
          <Icon icon={ICONS.thumbsUp} size={28} color={COLORS.pink} />
          B站一键三连，支持我们继续发电～
        </div>
      </div>

      <AbsoluteFill
        style={{
          background: COLORS.white,
          opacity: fadeOut,
          zIndex: 70,
          pointerEvents: 'none'
        }}
      />
    </AbsoluteFill>
  )
}
