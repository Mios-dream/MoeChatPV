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
import { ScenesScene } from './scenes/ScenesScene'
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
  scenarios: 375,
  sleep: 360,
  diary: 270,
  widgets: 420,
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

        {/* 3. 聊天展示：头部特写 + 多条符合人设的日常回复轮播。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.chat}>
          <VoiceScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 4. 聊天情景：从早到晚的早安、晚安。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scenarios}>
          <ScenesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 5. 睡眠模式：Live2D 真实睡眠状态（闭眼小憩 / 半醒回答）。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.sleep}>
          <SleepScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 6. 她的日记本。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.diary}>
          <GalleryScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 7. 功能演示：纯小组件演示（时钟 / 天气 / 每日一句 / 任务板 / 便签）。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.widgets}>
          <WidgetShowcase />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        {/* 8. 把她带回家。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.install}>
          <InstallScene />
        </TransitionSeries.Sequence>
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
