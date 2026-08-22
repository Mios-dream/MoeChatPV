import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { CAPTIONS, type Caption } from './captions'
import { COLORS, FONT } from './theme'

const SPEAKER_COLORS: Record<string, string> = {
  澪酱: COLORS.pinkDark,
  智乃: COLORS.pinkDark,
  旁白: '#9d7bd6'
}

const VoiceWave: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame()
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 26 }}>
      {[0, 1, 2, 3].map((i) => {
        const h = 5 + Math.abs(Math.sin(frame * 0.35 + i * 0.9)) * 18
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              borderRadius: 3,
              background: color,
              opacity: 0.9
            }}
          />
        )
      })}
    </div>
  )
}

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
  const color = caption.color ?? SPEAKER_COLORS[caption.speaker] ?? COLORS.pinkDark
  const { fps } = useVideoConfig()
  const typed = Math.floor(((globalFrame - caption.start) / fps) * 13)
  const cursor = typed < caption.text.length && Math.sin(globalFrame * 0.3) > -0.2

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
        {/* <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 20px',
            borderRadius: 999,
            background: color,
            color: COLORS.white,
            fontFamily: FONT.kaTong,
            fontSize: 27,
            whiteSpace: 'nowrap',
            boxShadow: `0 8px 20px -8px ${color}`,
            flexShrink: 0
          }}
        >
          {caption.speaker}
          <VoiceWave color="rgba(255,255,255,0.85)" />
        </div> */}
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
          {cursor ? <span style={{ color, fontWeight: 800, marginLeft: 2 }}>|</span> : null}
        </div>
        {/* <div
          style={{
            width: 5,
            alignSelf: 'stretch',
            borderRadius: 4,
            background: `${color}55`,
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${Math.min(100, (typed / caption.text.length) * 100)}%`,
              background: color,
              borderRadius: 4
            }}
          />
        </div> */}
      </div>
    </AbsoluteFill>
  )
}
