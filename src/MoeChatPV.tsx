import React from 'react'
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { none } from '@remotion/transitions/none'
import { SubtitleLayer } from './subtitles'
import { FeatureStageBackdrop } from './fx'
import { Opening } from './scenes/Opening'
import { Live2DCharacterShowcase } from './scenes/Live2DCharacterShowcase'
import { CHAT_SCENE_DURATION, VoiceScene } from './scenes/VoiceScene'
import { SleepScene, SLEEP_SCENE_DURATION } from './scenes/SleepScene'
import { GalleryScene, DIARY_SCENE_DURATION } from './scenes/GalleryScene'
import { WidgetShowcase, WIDGET_SCENE_DURATION } from './scenes/WidgetShowcase'
import { Outro } from './scenes/Outro'

// PV 主片段时长，单位为帧；相邻片段会被 TRANSITION 的时长叠加。
export const SCENE_DURATIONS = {
  opening: 270,
  hero: 375,
  chat: CHAT_SCENE_DURATION,
  widgetService: WIDGET_SCENE_DURATION,
  sleep: SLEEP_SCENE_DURATION,
  diary: DIARY_SCENE_DURATION,
  outro: 300
}

export const TRANSITION = 7
const BGM_FADE_IN = 15
const BGM_FADE_OUT = 60
const BGM_START = 106
const FEATURE_STAGE_START = SCENE_DURATIONS.opening - TRANSITION
const OUTRO_START =
  FEATURE_STAGE_START +
  SCENE_DURATIONS.hero -
  TRANSITION +
  SCENE_DURATIONS.chat -
  TRANSITION +
  SCENE_DURATIONS.widgetService -
  TRANSITION +
  SCENE_DURATIONS.diary -
  TRANSITION +
  SCENE_DURATIONS.sleep -
  TRANSITION
const IRIS_START = 238
// TransitionSeries begins the hero sequence 7 frames before the opening ends.
// Finish the iris expansion by that overlap boundary so the incoming backdrop
// cannot show through around the circle before the wipe has covered the frame.
const IRIS_SCALE_END = SCENE_DURATIONS.opening - TRANSITION
// Keep the circle fully opaque until the opening sequence ends. The hero
// backdrop and its content have completed the overlap transition by then.
const IRIS_RELEASE_START = SCENE_DURATIONS.opening
const IRIS_RELEASE_END = SCENE_DURATIONS.opening + 6

// Hero 阶段：角色亮相（立绘运镜、名称出现、问候），功能演示移到后半段的小组件场景。
const HeroCharacterStage: React.FC = () => {
  const frame = useCurrentFrame()
  const entryP = interpolate(frame, [0, TRANSITION], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <AbsoluteFill style={{ opacity: entryP }}>
      <Live2DCharacterShowcase />
    </AbsoluteFill>
  )
}

export const MoeChatPV: React.FC = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const bgmDurationInFrames = Math.max(1, durationInFrames - BGM_START)
  const t = linearTiming({ durationInFrames: TRANSITION })
  const irisScale = interpolate(frame, [IRIS_START, IRIS_SCALE_END], [0.03, 1.12], {
    easing: Easing.bezier(0.64, 0, 0.78, 0),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const irisOpacity = interpolate(frame, [IRIS_RELEASE_START, IRIS_RELEASE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const featureStageOpacity = interpolate(
    frame,
    [FEATURE_STAGE_START, OUTRO_START - TRANSITION, OUTRO_START],
    [1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )

  return (
    <AbsoluteFill style={{ background: '#fffdfe' }}>
      {/* 全片背景音乐，在开头和结尾淡入淡出。 */}
      <Audio
        src={staticFile('bgm/bgm.mp3')}
        volume={(frame) =>
          interpolate(
            frame,
            [0, BGM_FADE_IN, bgmDurationInFrames - BGM_FADE_OUT, bgmDurationInFrames],
            [0, 0.1, 0.1, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            }
          )
        }
        from={BGM_START}
      />
      {/* 角色展示至功能段共用同一个背景，花朵旋转不会在转场时重置。 */}
      <AbsoluteFill style={{ opacity: featureStageOpacity, pointerEvents: 'none' }}>
        <FeatureStageBackdrop />
      </AbsoluteFill>
      <TransitionSeries style={{ zIndex: 1 }}>
        {/* 1. 开场：问候语与项目名称。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.opening}>
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={none()} timing={t} />

        {/* 2. 角色展示：智乃登场。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hero}>
          <HeroCharacterStage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={none()} timing={t} />

        {/* 3. 日常交互：摸摸头回应。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.chat}>
          <VoiceScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={none()} timing={t} />

        {/* 4. 小组件服务：天气角色与桌面小组件。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.widgetService}>
          <WidgetShowcase />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={none()} timing={t} />

        {/* 5. 日记分享：只展示角色的日记内容。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.diary}>
          <GalleryScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={none()} timing={t} />

        {/* 6. 日常陪伴：日程时间轴与 Live2D 睡眠状态融合展示。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.sleep}>
          <SleepScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={none()} timing={t} />

        {/* 7. 结尾页：品牌与开源信息。 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {frame >= IRIS_START ? (
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
            opacity: irisOpacity,
            pointerEvents: 'none',
            zIndex: 70
          }}
        />
      ) : null}
      {/* 始终覆盖在所有场景上：字幕与全片进度条。 */}
      <SubtitleLayer />
    </AbsoluteFill>
  )
}
