import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { COLORS } from './theme'

// Deterministic pseudo random
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Petal = {
  x: number
  y0: number
  size: number
  speed: number
  swayAmp: number
  swayFreq: number
  phase: number
  rotSpeed: number
  opacity: number
}

const makePetals = (seed: number, count: number): Petal[] => {
  const rnd = mulberry32(seed)
  return Array.from({ length: count }, () => ({
    x: rnd() * 100,
    y0: rnd() * 110 - 10,
    size: 16 + rnd() * 22,
    speed: 0.12 + rnd() * 0.18,
    swayAmp: 18 + rnd() * 26,
    swayFreq: 0.004 + rnd() * 0.006,
    phase: rnd() * Math.PI * 2,
    rotSpeed: 0.8 + rnd() * 1.6,
    opacity: 0.55 + rnd() * 0.45
  }))
}

export const SakuraPetals: React.FC<{
  seed?: number
  count?: number
  tint?: string
}> = ({ seed = 7, count = 16, tint = COLORS.pink }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const petals = React.useMemo(() => makePetals(seed, count), [seed, count])

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {petals.map((p, i) => {
        const y = ((p.y0 + (frame * p.speed * fps) / 10) % 118) - 9
        const x = p.x + Math.sin(frame * p.swayFreq + p.phase) * p.swayAmp
        const rot = p.phase + frame * 0.05 * p.rotSpeed
        const wave = Math.sin(frame * 0.1 + i) * 0.08
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              opacity: p.opacity,
              transform: `translate(-50%, -50%) rotate(${rot}rad) scaleY(${1 + wave})`
            }}
          >
            <svg width={p.size} height={p.size} viewBox="-56 -56 112 112">
              <path
                d="M0,-43 C13,-59 36,-48 34,-29 C54,-31 63,-8 47,4 C62,20 49,43 30,37 C25,57 1,60 -8,43 C-24,59 -47,47 -43,28 C-63,28 -67,4 -49,-7 C-61,-24 -44,-45 -27,-37 C-21,-55 -6,-59 0,-43 Z"
                fill={tint}
                opacity={0.9}
              />
            </svg>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

type Sparkle = {
  x: number
  y: number
  size: number
  phase: number
  speed: number
}

const makeSparkles = (seed: number, count: number): Sparkle[] => {
  const rnd = mulberry32(seed)
  return Array.from({ length: count }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    size: 12 + rnd() * 22,
    phase: rnd() * Math.PI * 2,
    speed: 0.7 + rnd() * 1.1
  }))
}

export const Sparkles: React.FC<{
  seed?: number
  count?: number
  color?: string
}> = ({ seed = 42, count = 14, color = COLORS.gold }) => {
  const frame = useCurrentFrame()
  const sparkles = React.useMemo(() => makeSparkles(seed, count), [seed, count])
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {sparkles.map((s, i) => {
        const v = Math.abs(Math.sin(frame * 0.07 * s.speed + s.phase))
        const scale = 0.2 + v
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: v * 0.9,
              transform: `translate(-50%, -50%) scale(${scale})`
            }}
          >
            <svg width={s.size} height={s.size} viewBox="-50 -50 100 100">
              <path
                d="M0,-42 C6,-10 10,-6 42,0 C10,6 6,10 0,42 C-6,10 -10,6 -42,0 C-10,-6 -6,-10 0,-42 Z"
                fill={color}
              />
            </svg>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

export const Bokeh: React.FC<{ seed?: number; count?: number }> = ({ seed = 99, count = 8 }) => {
  const frame = useCurrentFrame()
  const rnd = React.useMemo(() => mulberry32(seed), [seed])
  const circles = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: rnd() * 100,
        y: rnd() * 100,
        size: 90 + rnd() * 190,
        color: [COLORS.pinkPale, COLORS.pinkShadow, '#ffe3ef', '#ffd9e8'][Math.floor(rnd() * 4)],
        phase: rnd() * Math.PI * 2
      })),
    [count, rnd]
  )
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {circles.map((c, i) => {
        const drift = Math.sin(frame * 0.01 + c.phase) * 14
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: c.size,
              height: c.size,
              borderRadius: '50%',
              background: c.color,
              filter: 'blur(28px)',
              opacity: 0.5,
              transform: `translate(${drift}px, 0px)`
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

export const GradientBackground: React.FC<{
  from?: string
  via?: string
  to?: string
}> = ({ from = '#fffdfe', via = '#ffe9f1', to = '#ffd3e2' }) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${from} 0%, ${via} 45%, ${to} 100%)`
      }}
    />
  )
}

export const DriftingBlobs: React.FC<{
  seed?: number
  colorA?: string
  colorB?: string
}> = ({ seed = 5, colorA = COLORS.pinkLight, colorB = COLORS.purple }) => {
  const frame = useCurrentFrame()
  const rnd = React.useMemo(() => mulberry32(seed), [seed])
  const blobs = React.useMemo(
    () =>
      [0, 1, 2].map(() => ({
        x: 15 + rnd() * 70,
        y: 12 + rnd() * 70,
        size: 340 + rnd() * 300,
        color: rnd() > 0.5 ? colorA : colorB,
        px: rnd() * Math.PI * 2,
        py: rnd() * Math.PI * 2
      })),
    [rnd, colorA, colorB]
  )
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {blobs.map((b, i) => {
        const x = b.x + Math.sin(frame * 0.012 + b.px) * 4
        const y = b.y + Math.cos(frame * 0.01 + b.py) * 4
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              background: b.color,
              filter: 'blur(70px)',
              opacity: 0.34,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

export const BottomRibbons: React.FC<{ tint?: string }> = ({ tint = COLORS.pink }) => {
  const frame = useCurrentFrame()
  const shift = (frame * 0.4) % 240
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -80,
          width: 1200,
          height: 180,
          borderRadius: '50%',
          background: tint,
          opacity: 0.12,
          transform: `translateX(${shift}px)`
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          right: -120,
          width: 1400,
          height: 200,
          borderRadius: '50%',
          background: tint,
          opacity: 0.1,
          transform: `translateX(${-shift}px)`
        }}
      />
    </AbsoluteFill>
  )
}

export const FloatingHearts: React.FC<{
  seed?: number
  count?: number
}> = ({ seed = 21, count = 7 }) => {
  const frame = useCurrentFrame()
  const rnd = React.useMemo(() => mulberry32(seed), [seed])
  const hearts = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: 8 + rnd() * 84,
        y0: 105 + rnd() * 30,
        size: 14 + rnd() * 18,
        speed: 0.35 + rnd() * 0.3,
        sway: 10 + rnd() * 18,
        phase: rnd() * Math.PI * 2,
        color: [COLORS.pink, COLORS.pinkDark, '#ff8fab', COLORS.pinkLight][Math.floor(rnd() * 4)]
      })),
    [count, rnd]
  )
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {hearts.map((h, i) => {
        const y = ((h.y0 - frame * 0.12 * h.speed) % 115) - 8
        const x = h.x + Math.sin(frame * 0.045 + h.phase) * h.sway
        const scale = 0.75 + 0.45 * Math.abs(Math.sin(frame * 0.06 + i))
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              opacity: 0.75,
              transform: `translate(-50%, -50%) scale(${scale})`
            }}
          >
            <svg width={h.size} height={h.size} viewBox="-50 -45 100 95">
              <path
                d="M0,28 C-30,8 -48,-8 -38,-24 C-30,-37 -12,-32 0,-18 C12,-32 30,-37 38,-24 C48,-8 30,8 0,28 Z"
                fill={h.color}
              />
            </svg>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

/**
 * 场景背景
 * @param from 渐变起始颜色
 * @param via 渐变中间颜色
 * @param to 渐变结束颜色
 * @param petals 是否显示樱花花瓣
 * @param sparkles 是否显示闪光
 * @param blobs 是否显示漂浮的彩色圆点
 * @param hearts 是否显示漂浮的爱心
 * @param ribbons 是否显示底部飘带
 * @param petalSeed 花瓣随机种子
 * @param sparkleSeed 闪光随机种子
 * @param blobSeed 漂浮圆点随机种子
 * @param petalTint 花瓣颜色
 * @returns
 */
export const SceneBackground: React.FC<{
  from?: string
  via?: string
  to?: string
  petals?: boolean
  sparkles?: boolean
  blobs?: boolean
  hearts?: boolean
  ribbons?: boolean
  petalSeed?: number
  sparkleSeed?: number
  blobSeed?: number
  petalTint?: string
}> = ({
  from,
  via,
  to,
  petals = false,
  sparkles = true,
  blobs = true,
  hearts = false,
  ribbons = true,
  petalSeed = 7,
  sparkleSeed = 42,
  blobSeed = 5,
  petalTint = COLORS.pink
}) => {
  return (
    <AbsoluteFill>
      <GradientBackground from={from} via={via} to={to} />
      {blobs ? <DriftingBlobs seed={blobSeed} /> : null}
      {ribbons ? <BottomRibbons tint={petalTint} /> : null}
      {petals ? <SakuraPetals seed={petalSeed} tint={petalTint} /> : null}
      {sparkles ? <Sparkles seed={sparkleSeed} /> : null}
      {hearts ? <FloatingHearts /> : null}
    </AbsoluteFill>
  )
}

/**
 * 功能演示阶段同款背景：纯白粉底色 + 斜纹 + 星点闪光。
 * 后续所有场景统一使用这套背景，保持全片视觉一致。
 */
export const StripedStage: React.FC<{
  opacity?: number
  sparkleSeed?: number
}> = ({ opacity = 0.68, sparkleSeed = 61 }) => {
  return (
    <AbsoluteFill>
      <SceneBackground
        from="#fffafc"
        via="#fffafc"
        to="#fffafc"
        hearts={false}
        sparkleSeed={sparkleSeed}
        blobs={false}
        ribbons={false}
      />
      <AbsoluteFill
        style={{
          opacity,
          background:
            'repeating-linear-gradient(135deg, rgba(255,152,180,0.24) 0 50px, transparent 50px 100px)'
        }}
      />
    </AbsoluteFill>
  )
}

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1)
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1)
export const popEase = Easing.bezier(0.34, 1.56, 0.64, 1)

export const usePop = (frame: number, delay: number, duration = 28) => {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    easing: popEase,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
}

export const useFade = (frame: number, delay: number, duration = 24): number => {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
}
