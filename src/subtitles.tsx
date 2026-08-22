import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { CAPTIONS, type Caption } from './captions'
import { COLORS, FONT } from './theme'

export const SubtitleLayer: React.FC = () => {
  const frame = useCurrentFrame()
  const active = CAPTIONS.find((c) => frame >= c.start && frame < c.end)
  if (!active) {
    return <AbsoluteFill style={{ pointerEvents: 'none' }} />
  }
  return <SubtitleBar caption={active} globalFrame={frame} />
}

const SubtitleBar: React.FC<{ caption: Caption; globalFrame: number }> = ({
  caption,
  globalFrame
}) => {
  const local = globalFrame - caption.start
  const inP = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const outP = interpolate(
    local,
    [caption.end - caption.start - 14, caption.end - caption.start],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )
  const opacity = Math.min(inP, outP)

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 92,
        zIndex: 80
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          maxWidth: 1400,
          minHeight: 104,
          padding: '18px 34px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 18px 50px -16px ${COLORS.pinkShadow}, 0 4px 14px -6px rgba(251,114,153,0.2)`,
          opacity,
          transform: `translateY(${(1 - inP) * 30}px) scale(${0.96 + 0.04 * inP})`
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily: FONT.sanJi,
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.textDark,
            lineHeight: 1.35,
            letterSpacing: 0.5
          }}
        >
          {caption.text}
        </div>
      </div>
    </AbsoluteFill>
  )
}
