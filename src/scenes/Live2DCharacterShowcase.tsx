import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame
} from 'remotion'
import { Audio } from '@remotion/media'
import { FONT } from '../theme'

export const SHOWCASE_DURATION = 340

type PortraitShotProps = {
  from: number
  to: number
  imageY: number
  imageScale: number
  imageX?: number
  settleTo?: {
    imageX: number
    imageY: number
    imageScale: number
    end: number
    fadeOutStart: number
    fadeOutEnd: number
  }
}

const PortraitShot: React.FC<PortraitShotProps> = ({
  from,
  to,
  imageY,
  imageScale,
  imageX = 0,
  settleTo
}) => {
  const frame = useCurrentFrame()
  const duration = to - from
  const local = frame - from
  const fadeIn = interpolate(local, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const fadeOutOpacity = settleTo
    ? interpolate(local, [settleTo.fadeOutStart, settleTo.fadeOutEnd], [1, 0], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : interpolate(local, [duration - 14, duration], [1, 0], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
  const opacity = Math.min(fadeIn, fadeOutOpacity)
  const camera = interpolate(local, [0, duration], [0.98, 1.05], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const settleP = settleTo
    ? interpolate(local, [duration, settleTo.end], [0, 1], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 0
  const settledImageScale = settleTo
    ? interpolate(settleP, [0, 1], [imageScale * camera, settleTo.imageScale])
    : imageScale * camera
  const settledImageX = settleTo ? interpolate(settleP, [0, 1], [imageX, settleTo.imageX]) : imageX
  const settledImageY = settleTo ? interpolate(settleP, [0, 1], [imageY, settleTo.imageY]) : imageY

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1120,
          height: 1680,
          transform: `translate(calc(-50% + ${settledImageX}px), calc(-50% + ${settledImageY}px)) scale(${settledImageScale})`,
          transformOrigin: 'center center',
          zIndex: 1
        }}
      >
        <Img
          src={staticFile('images/智乃立绘.png')}
          style={{ width: '100%', height: '100%', objectFit: 'fill' }}
        />
      </div>
    </div>
  )
}

const CharacterIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const outroP = interpolate(frame, [120, 132], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const nameP = interpolate(frame, [30, 200], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: outroP }}>
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 400,
          width: 900,
          zIndex: 3,
          opacity: nameP,
          transform: `translateY(${(1 - nameP) * 28}px)`
        }}
      >
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT.kaTong,
            fontSize: 200,
            lineHeight: 1,
            color: '#FFA8C5',
            textShadow: '10px 10px 5px rgba(255,255,255,1)'
          }}
        >
          香风智乃
        </div>
        <div
          style={{
            marginTop: -20,
            marginLeft: 450,
            width: 300,
            height: 120,
            background: '#A7467C',
            color: '#fff',
            fontSize: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.sanJi
          }}
        >
          内置助手
        </div>
      </div>
    </div>
  )
}

type FlowerProps = {
  left: number
  top: number
  size: number
  opacity: number
  offset: number
}

const Flower: React.FC<FlowerProps> = ({ left, top, size, opacity, offset }) => {
  const frame = useCurrentFrame()
  const petalWidth = size * 0.52
  const petalHeight = size * 0.38

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        opacity,
        transform: `translate(-50%, -50%) rotate(${offset + frame * 5}deg)`,
        transformOrigin: 'center center'
      }}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: petalWidth,
            height: petalHeight,
            background: '#f6a7bf',
            borderRadius: '50%',
            transform: `translateY(-50%) rotate(${index * 72}deg)`,
            transformOrigin: '0 50%'
          }}
        />
      ))}
    </div>
  )
}

export const Live2DCharacterShowcase: React.FC = () => {
  const frame = useCurrentFrame()
  const bannerExitP = interpolate(frame, [SHOWCASE_DURATION - 30, SHOWCASE_DURATION], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
        <div
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: 90,
            width: '100%',
            background: '#fca5b9',
            position: 'absolute',
            transform: `translateY(${bannerExitP * -120}px)`
          }}
        />
        <div
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: 90,
            width: '100%',
            background: '#fca5b9',
            position: 'absolute',
            transform: `translateY(${bannerExitP * 120}px)`
          }}
        />
        <Flower left={170} top={210} size={118} opacity={0.58} offset={12} />
        <Flower left={1770} top={210} size={82} opacity={0.5} offset={72} />
        <Flower left={170} top={870} size={76} opacity={0.48} offset={210} />
        <Flower left={1740} top={850} size={142} opacity={0.56} offset={148} />
      </AbsoluteFill>
      <PortraitShot from={0} to={66} imageY={-1000} imageScale={2} />
      <PortraitShot from={54} to={130} imageY={0} imageX={-200} imageScale={2} />
      <PortraitShot
        from={118}
        to={196}
        imageY={1200}
        imageX={-200}
        imageScale={2}
        settleTo={{
          imageX: 300,
          imageY: 700,
          imageScale: 1.5,
          end: 136,
          fadeOutStart: 170,
          fadeOutEnd: 190
        }}
      />
      <Sequence from={160} durationInFrames={SHOWCASE_DURATION - 164} premountFor={12}>
        <Audio src={staticFile('live2d-generated/greeting/voice.wav')} volume={0.96} from={1} />
      </Sequence>
      <Sequence from={170} durationInFrames={SHOWCASE_DURATION - 170} premountFor={12}>
        <CharacterIntro />
      </Sequence>
    </AbsoluteFill>
  )
}
