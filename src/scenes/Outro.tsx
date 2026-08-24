import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { StripedStage, usePop } from '../fx'
import { Mascot } from '../mascot'
import { FeatureChip, PopText } from '../ui'
import { Icon, ICONS } from '../icons'

// 延续原有结尾构图，仅以中性的项目与开源信息完成收束。
export const Outro: React.FC = () => {
  const frame = useCurrentFrame()
  const cardP = usePop(frame, 140)
  const chipsP = usePop(frame, 185)
  const updateP = usePop(frame, 225)
  const backdropP = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: backdropP }}>
        <StripedStage />
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: 150, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <PopText text="开源桌面助手 MoeChat" delay={45} fontSize={92} color={COLORS.pinkDark} gap={4} />
      </div>

      <div style={{ position: 'absolute', left: '50%', top: 330, transform: 'translateX(-50%)' }}>
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
          }}
        >
          <Icon icon={ICONS.star} size={52} color={COLORS.gold} />
          <div>
            <div style={{ fontFamily: FONT.kaTong, fontSize: 36, color: COLORS.pinkDark }}>MoeChat-APP</div>
            <div style={{ fontFamily: FONT.sanJi, fontSize: 24, color: COLORS.textGray }}>
              github.com/Mios-dream/MoeChat-APP
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, opacity: chipsP }}>
          <FeatureChip label="免费使用" icon={<Icon icon={ICONS.gift} size={24} color={COLORS.pink} />} delay={185} size={22} />
          <FeatureChip label="开源项目" icon={<Icon icon={ICONS.code} size={24} color={COLORS.pink} />} delay={205} size={22} />
          <FeatureChip label="持续更新" icon={<Icon icon={ICONS.arrowsRotate} size={24} color={COLORS.pink} />} delay={225} size={22} />
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
            opacity: updateP,
          }}
        >
          <Icon icon={ICONS.thumbsUp} size={28} color={COLORS.pink} />
          欢迎关注项目后续更新
        </div>
      </div>

    </AbsoluteFill>
  )
}
