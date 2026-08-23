import React from 'react'
import { AbsoluteFill, Sequence, interpolate, staticFile, useVideoConfig } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { SubtitleLayer } from './subtitles'
import { StripedStage } from './fx'
import { Opening } from './scenes/Opening'
import { Live2DCharacterShowcase, SHOWCASE_DURATION } from './scenes/Live2DCharacterShowcase'
import { CHAT_SCENE_DURATION, VoiceScene } from './scenes/VoiceScene'
import { SleepScene } from './scenes/SleepScene'
import { GalleryScene } from './scenes/GalleryScene'
import { WidgetShowcase } from './scenes/WidgetShowcase'
import { InstallScene } from './scenes/InstallScene'
import { Outro } from './scenes/Outro'

// PV 主片段时长，单位为帧；相邻片段会被 TRANSITION 的时长叠加。
export const SCENE_DURATIONS = {
  opening: 270,
  hero: 375,
  chat: CHAT_SCENE_DURATION,
  widgetService: 420,
  sleep: 560,
  diary: 270,
  install: 420,
  outro: 420
}

export const TRANSITION = 15

// Hero 阶段：角色亮相（立绘运镜、名称出现、问候），功能演示移到后半段的小组件场景。
const HeroCharacterStage: React.FC = () => (
  <AbsoluteFill>
    <StripedStage />
    <Sequence durationInFrames={SHOWCASE_DURATION}>
      <Live2DCharacterShowcase />
    </Sequence>
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
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 2. 角色展示：智乃登场。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hero}>
          <HeroCharacterStage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 3. 日常交互：摸摸头回应。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.chat}>
          <VoiceScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 4. 小组件服务：天气角色与桌面小组件。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.widgetService}>
          <WidgetShowcase />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 5. 日记分享：只展示角色的日记内容。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.diary}>
          <GalleryScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 6. 日常陪伴：日程时间轴与 Live2D 睡眠状态融合展示。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.sleep}>
          <SleepScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 7. 把她带回家。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.install}>
          <InstallScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 8. 结尾页。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {/* 始终覆盖在所有场景上：字幕与全片进度条。 */}
      <SubtitleLayer />
    </AbsoluteFill>
  )
}
