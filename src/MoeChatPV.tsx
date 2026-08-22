import React from 'react'
import { AbsoluteFill, Sequence, interpolate, staticFile, useVideoConfig } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { SubtitleLayer } from './subtitles'
import { SceneBackground } from './fx'
import { Opening } from './scenes/Opening'
import { Live2DCharacterShowcase, SHOWCASE_DURATION } from './scenes/Live2DCharacterShowcase'
import { FEATURE_START, Live2DFeatureShowcase } from './scenes/Live2DFeatureShowcase'
import { VoiceScene } from './scenes/VoiceScene'
import { ScenesScene } from './scenes/ScenesScene'
import { DesktopScene } from './scenes/DesktopScene'
import { PerfScene } from './scenes/PerfScene'
import { GalleryScene } from './scenes/GalleryScene'
import { InstallScene } from './scenes/InstallScene'
import { Outro } from './scenes/Outro'

// PV 主片段时长，单位为帧；相邻片段会被 TRANSITION 的时长叠加。
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

// Live2D 两个阶段共用的斜纹纹理。
const HeroStripes: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill
    style={{
      opacity,
      background:
        'repeating-linear-gradient(135deg, rgba(255,152,180,0.24) 0 50px, transparent 50px 100px)'
    }}
  />
)

// Hero 阶段一：角色立绘、名称出现、旋转花朵与横幅退场。
// 占 Hero 段的第 0-319 帧；角色展示主体在第 308 帧结束。
const HeroCharacterStage: React.FC = () => (
  <AbsoluteFill>
    <SceneBackground
      from="#fffafc"
      via="#fffafc"
      to="#fffafc"
      hearts={false}
      sparkleSeed={61}
      blobs={false}
      ribbons={false}
    />
    <HeroStripes opacity={0.68} />
    <Sequence durationInFrames={SHOWCASE_DURATION}>
      <Live2DCharacterShowcase />
    </Sequence>
  </AbsoluteFill>
)

// Hero 阶段二：功能演示窗口与 Live2D 助手展示。
// 从 FEATURE_START 开始，此时角色介绍阶段的背景已经完成退场。
const HeroFeatureStage: React.FC = () => (
  <AbsoluteFill>
    <SceneBackground
      from="#fffafc"
      via="#fffafc"
      to="#fffafc"
      hearts={false}
      sparkleSeed={61}
      blobs={false}
      ribbons={false}
    />
    <HeroStripes opacity={0.68} />
    <Live2DFeatureShowcase />
  </AbsoluteFill>
)

export const MoeChatPV: React.FC = () => {
  const { durationInFrames } = useVideoConfig()
  const t = linearTiming({ durationInFrames: TRANSITION })

  return (
    <AbsoluteFill style={{ background: '#fffdfe' }}>
      {/* 全片背景音乐，在开头和结尾淡入淡出。 */}
      <Audio
        src={staticFile('bgm/bgm.mp3')}
        volume={(frame) =>
          interpolate(frame, [0, 15, durationInFrames - 45, durationInFrames], [0, 0.1, 0.1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          })
        }
        from={106}
      />
      <TransitionSeries>
        {/* 1. 开场：问候语与项目名称。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.opening}>
          <Opening />
        </TransitionSeries.Sequence>
        {/* 开场 -> Live2D 主展示：淡入淡出。 */}
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 2. Live2D 主展示：先介绍角色，再展示产品功能。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hero}>
          <AbsoluteFill>
            {/* 角色介绍的背景与内容：第 0-319 帧。 */}
            <Sequence durationInFrames={FEATURE_START}>
              <HeroCharacterStage />
            </Sequence>
            {/* 功能展示的背景与内容：从第 320 帧开始。 */}
            <Sequence from={FEATURE_START}>
              <HeroFeatureStage />
            </Sequence>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        {/* Live2D 主展示 -> 语音功能：从左侧滑入。 */}
        <TransitionSeries.Transition presentation={slide({ direction: 'from-left' })} timing={t} />

        {/* 3. 语音交互演示。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.voice}>
          <VoiceScene />
        </TransitionSeries.Sequence>
        {/* 语音功能 -> 日常场景：从下方滑入。 */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={t}
        />

        {/* 4. 日常陪伴场景。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scenes}>
          <ScenesScene />
        </TransitionSeries.Sequence>
        {/* 日常场景 -> 桌面视图：淡入淡出。 */}
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 5. 桌面应用总览。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.desktop}>
          <DesktopScene />
        </TransitionSeries.Sequence>
        {/* 桌面视图 -> 性能展示：从右侧滑入。 */}
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={t} />

        {/* 6. 性能与低占用展示。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.perf}>
          <PerfScene />
        </TransitionSeries.Sequence>
        {/* 性能展示 -> 角色画廊：从左至右擦除。 */}
        <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={t} />

        {/* 7. 角色画廊。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.gallery}>
          <GalleryScene />
        </TransitionSeries.Sequence>
        {/* 角色画廊 -> 安装引导：淡入淡出。 */}
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 8. 安装与开始使用。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.install}>
          <InstallScene />
        </TransitionSeries.Sequence>
        {/* 安装引导 -> 结尾：淡入淡出。 */}
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 9. 结尾页。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {/* 始终覆盖在所有场景上：字幕与全片进度条。 */}
      <SubtitleLayer />
    </AbsoluteFill>
  )
}
