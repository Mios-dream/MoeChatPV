import React from 'react'
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from './theme'
import { usePop } from './fx'

export const Mascot: React.FC<{
  size: number
  delay?: number
  mood?: 'idle' | 'happy' | 'wave' | 'sleep'
  glow?: boolean
  style?: React.CSSProperties
}> = ({ size, delay = 0, mood = 'idle', glow = true, style }) => {
  const frame = useCurrentFrame()
  const pop = usePop(frame, delay)
  const bob = Math.sin(frame * 0.055) * 20 + 40

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        opacity: interpolate(pop, [0, 1], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        }),
        transform: `translateY(${bob}px) scale(${0.6 + 0.4 * pop}) `,
        ...style
      }}
    >
      {glow ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '2%',
            width: size * 0.9,
            height: size * 0.2,
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            background: `radial-gradient(closest-side, ${COLORS.pinkShadow}, transparent)`,
            filter: 'blur(10px)',
            opacity: 0.8
          }}
        />
      ) : null}
      <Img
        src={staticFile('images/mascot.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 2,
          filter: `drop-shadow(0 18px 30px ${COLORS.pinkShadow})`
        }}
      />
    </div>
  )
}

export const SpeechBubble: React.FC<{
  children: React.ReactNode
  delay?: number
  width?: number
  align?: 'left' | 'right'
}> = ({ children, delay = 0, width = 520, align = 'left' }) => {
  const frame = useCurrentFrame()
  const p = usePop(frame, delay)
  const isRight = align === 'right'
  return (
    <div
      style={{
        position: 'relative',
        maxWidth: width,
        padding: '22px 28px',
        borderRadius: 26,
        borderTopLeftRadius: isRight ? 26 : 10,
        borderTopRightRadius: isRight ? 10 : 26,
        background: 'rgba(255,255,255,0.96)',
        border: `2.5px solid ${COLORS.pinkPale}`,
        boxShadow: `0 18px 44px -16px ${COLORS.pinkShadow}`,
        fontFamily: FONT.sanJi,
        fontSize: 30,
        lineHeight: 1.5,
        color: COLORS.textDark,
        fontWeight: 600,
        opacity: p,
        transform: `scale(${0.7 + 0.3 * p})`,
        zIndex: 5
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 18,
          [isRight ? 'right' : 'left']: -16,
          width: 0,
          height: 0,
          borderTop: `18px solid transparent`,
          borderBottom: `14px solid transparent`,
          borderRight: isRight ? 'none' : `20px solid ${COLORS.pinkPale}`,
          borderLeft: isRight ? `20px solid ${COLORS.pinkPale}` : 'none',
          filter: 'drop-shadow(0 2px 3px rgba(251,114,153,0.15))'
        }}
      />
    </div>
  )
}
