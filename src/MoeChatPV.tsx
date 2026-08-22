import React from 'react'
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { SubtitleLayer } from './subtitles'
import { ProgressBar } from './ui'
import { Opening } from './scenes/Opening'
import { Live2DHero } from './scenes/Live2DHero'
import { VoiceScene } from './scenes/VoiceScene'
import { ScenesScene } from './scenes/ScenesScene'
import { DesktopScene } from './scenes/DesktopScene'
import { PerfScene } from './scenes/PerfScene'
import { GalleryScene } from './scenes/GalleryScene'
import { InstallScene } from './scenes/InstallScene'
import { Outro } from './scenes/Outro'

export const SCENE_DURATIONS = {
  opening: 270,
  hero: 750,
  voice: 330,
  scenes: 375,
  desktop: 300,
  perf: 195,
  gallery: 240,
  install: 495,
  outro: 420
}

export const TRANSITION = 15

export const MoeChatPV: React.FC = () => {
  const { durationInFrames } = useVideoConfig()
  const t = linearTiming({ durationInFrames: TRANSITION })

  return (
    <AbsoluteFill style={{ background: '#fffdfe' }}>
      <Audio
        src={staticFile('bgm/bgm.mp3')}
        volume={(frame) =>
          interpolate(frame, [0, 15, durationInFrames - 45, durationInFrames], [0, 0.16, 0.16, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          })
        }
        from={106}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.opening}>
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hero}>
          <Live2DHero />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-left' })} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.voice}>
          <VoiceScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={t}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scenes}>
          <ScenesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.desktop}>
          <DesktopScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.perf}>
          <PerfScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.gallery}>
          <GalleryScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.install}>
          <InstallScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SubtitleLayer />
      <ProgressBar totalFrames={durationInFrames} />
    </AbsoluteFill>
  )
}
