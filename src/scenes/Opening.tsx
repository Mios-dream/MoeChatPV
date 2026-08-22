import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame
} from 'remotion'
import { Audio } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { easeOut, useFade, usePop } from '../fx'
import { PopText } from '../ui'

const SakuraFlower: React.FC<{
  size: number
  x: number
  y: number
  speed?: number
}> = ({ size, x, y, speed = 1 }) => {
  const frame = useCurrentFrame()
  const rot = frame * 0.045 * speed
  const pulse = 1 + 0.06 * Math.sin(frame * 0.08 * speed)
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}rad) scale(${pulse})`
      }}
    >
      <svg width={size} height={size} viewBox="-60 -60 120 120">
        <path
          d="M0,-43 C13,-59 36,-48 34,-29 C54,-31 63,-8 47,4 C62,20 49,43 30,37 C25,57 1,60 -8,43 C-24,59 -47,47 -43,28 C-63,28 -67,4 -49,-7 C-61,-24 -44,-45 -27,-37 C-21,-55 -6,-59 0,-43 Z"
          fill={COLORS.pink}
          opacity={0.82}
        />
      </svg>
    </div>
  )
}

const QUOTE_START = 10
const QUOTE_DURATION = 175
const QUOTE_END = QUOTE_START + QUOTE_DURATION

export const Opening: React.FC = () => {
  const frame = useCurrentFrame()

  // Stage 1: a single, quiet greeting that fades into the white opening.
  const quote = '所以，阁下一定不要放弃自己的梦想啊！'
  const quoteIn = useFade(frame, QUOTE_START, QUOTE_START + 25)
  const quoteOut = interpolate(frame, [QUOTE_END - 30, QUOTE_END], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const quoteOpacity = Math.min(quoteIn, quoteOut)
  const quoteScale = interpolate(
    frame,
    [QUOTE_START, QUOTE_START + 40, QUOTE_END - 30, QUOTE_END],
    [0.96, 1, 1, 1.04],
    {
      easing: easeOut,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )
  const quoteY = interpolate(frame, [QUOTE_START, QUOTE_START + 40], [24, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  // Stage 2: logo + name
  const iconP = usePop(frame, 173)
  const nameP = usePop(frame, 187)
  const subP = useFade(frame, 207)
  const stage2 = interpolate(frame, [165, 189], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const irisScale = interpolate(frame, [238, 264], [0.03, 1.12], {
    easing: Easing.bezier(0.64, 0, 0.78, 0),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <Sequence from={QUOTE_START} durationInFrames={QUOTE_DURATION}>
        <Audio volume={0.5} src={staticFile('audio/所以，阁下一定不要放弃自己的梦想啊！.wav')} />
      </Sequence>
      <SakuraFlower size={76} x={235} y={388} speed={0.8} />
      <SakuraFlower size={48} x={330} y={430} speed={1.1} />
      <SakuraFlower size={66} x={1665} y={674} speed={0.9} />
      <SakuraFlower size={42} x={1582} y={710} speed={1.2} />
      {/* Stage 1: dialogue */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px) scale(${quoteScale})`
        }}
      >
        <div
          style={{
            fontFamily: FONT.kaTong,
            fontSize: 72,
            color: COLORS.pink,
            textShadow: `0 12px 40px ${COLORS.pinkShadow}`,
            letterSpacing: 4,
            lineHeight: 1.3,
            textAlign: 'center',
            padding: '0 120px'
          }}
        >
          {quote}
        </div>
      </AbsoluteFill>
      {/* Stage 2: project name + icon */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: stage2
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18
          }}
        >
          <div
            style={{
              opacity: iconP,
              transform: `scale(${0.5 + 0.5 * iconP})`,
              borderRadius: 42,
              overflow: 'hidden',
              boxShadow: `0 24px 70px -22px ${COLORS.pinkShadow}`,
              background: COLORS.white,
              border: `3px solid ${COLORS.pinkPale}`
            }}
          >
            <Img
              src={staticFile('images/app-icon.png')}
              style={{ width: 180, height: 180, objectFit: 'cover' }}
            />
          </div>
          <div style={{ opacity: nameP }}>
            <PopText
              fontFamily={FONT.kaTong}
              text="MoeChat"
              delay={187}
              fontSize={148}
              color={COLORS.pinkDark}
            />
          </div>
          <div
            style={{
              opacity: subP,
              transform: `translateY(${(1 - subP) * 22}px)`,
              fontFamily: FONT.sanJi,
              fontSize: 38,
              color: COLORS.textDark,
              fontWeight: 600,
              background: 'rgba(255,255,255,0.78)',
              padding: '12px 34px',
              borderRadius: 999,
              border: `2px solid ${COLORS.pinkPale}`,
              letterSpacing: 2
            }}
          >
            桌面AI助手 · Live2D 看板娘
          </div>
        </div>
      </AbsoluteFill>
      {frame >= 238 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 2400,
            height: 2400,
            borderRadius: '50%',
            background: '#ffe5ef',
            transform: `translate(-50%, -50%) scale(${irisScale})`,
            pointerEvents: 'none'
          }}
        />
      ) : null}
    </AbsoluteFill>
  )
}
