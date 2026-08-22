import React from 'react'
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from 'remotion'
import { Audio, Video } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { useFade, usePop } from '../fx'
import { FeatureChip, WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'

export const FEATURE_START = 320
const FEATURE_VOICE_DURATION = 368

const TABS = [
  { icon: ICONS.comments, label: '聊天', start: 0, caption: '无论何时，智乃都会陪伴着阁下' },
  {
    icon: ICONS.listCheck,
    label: '待办',
    start: 108,
    caption: '记录下自己的待办事项，智乃会监督你完成'
  },
  { icon: ICONS.cloudSun, label: '天气', start: 216, caption: '出门前，让智乃帮你看看天气吧' },
  {
    icon: ICONS.book,
    label: '日记',
    start: 324,
    caption: '智乃也会有独属于自己的日记，才不会让阁下偷看呢'
  }
]

const TAB_VIDEOS = [
  'video/clips/chat.mp4',
  'video/clips/todo.mp4',
  'video/clips/weather.mp4',
  'video/clips/diary.mp4'
]

export const Live2DFeatureShowcase: React.FC = () => {
  const frame = useCurrentFrame()
  const timelineFrame = FEATURE_START + frame
  const featureP = usePop(timelineFrame, FEATURE_START, 34)
  const panelP = usePop(timelineFrame, FEATURE_START + 12, 34)
  const activeTab =
    timelineFrame < FEATURE_START + TABS[1].start
      ? 0
      : timelineFrame < FEATURE_START + TABS[2].start
        ? 1
        : timelineFrame < FEATURE_START + TABS[3].start
          ? 2
          : 3

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 72,
          opacity: useFade(timelineFrame, FEATURE_START, 26),
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <Icon icon={ICONS.wand} size={40} color={COLORS.gold} />
        <div
          style={{
            fontFamily: FONT.kaTong,
            fontSize: 50,
            color: COLORS.pinkDark,
            letterSpacing: 2,
            textShadow: `0 6px 24px ${COLORS.pinkShadow}`
          }}
        >
          她住进桌面以后
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 190,
          opacity: panelP,
          transform: `translateX(${(1 - panelP) * -50}px) scale(${0.94 + 0.06 * panelP})`,
          transformOrigin: 'left top'
        }}
      >
        <WindowFrame width={1300} height={850} title="桌面演示" popDelay={12}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              background: '#fff'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 22px',
                borderBottom: `1.5px solid ${COLORS.pinkPale}`,
                background: '#fff8fa',
                flexShrink: 0
              }}
            >
              {TABS.map((t, i) => {
                const active = i === activeTab
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '10px 22px',
                      borderRadius: 999,
                      fontFamily: FONT.sanJi,
                      fontSize: 24,
                      fontWeight: 700,
                      color: active ? COLORS.white : COLORS.textGray,
                      background: active
                        ? `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkDark})`
                        : 'rgba(255,255,255,0.9)',
                      border: `2px solid ${active ? 'transparent' : COLORS.pinkPale}`,
                      boxShadow: active ? `0 8px 20px -8px ${COLORS.pinkShadow}` : 'none'
                    }}
                  >
                    <Icon icon={t.icon} size={22} color={active ? COLORS.white : COLORS.pinkDark} />
                    {t.label}
                  </div>
                )
              })}
            </div>
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              {TAB_VIDEOS.map((src, i) => {
                const start = TABS[i].start
                const duration = i === TABS.length - 1 ? 120 : 108
                return (
                  <Sequence key={src} from={start} durationInFrames={duration}>
                    <Video
                      src={staticFile(src)}
                      muted
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center'
                      }}
                    />
                  </Sequence>
                )
              })}
              <div
                style={{
                  position: 'absolute',
                  left: 24,
                  bottom: 22,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 24px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.94)',
                  border: `1.5px solid ${COLORS.pinkPale}`,
                  fontFamily: FONT.sanJi,
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.textDark,
                  boxShadow: `0 10px 24px -10px ${COLORS.pinkShadow}`
                }}
              >
                <Icon icon={TABS[activeTab].icon} size={22} color={COLORS.pinkDark} />
                {TABS[activeTab].caption}
              </div>
            </div>
          </div>
        </WindowFrame>
      </div>
      <div
        style={{
          position: 'absolute',
          right: -400,
          top: 0,
          width: 1500,
          height: 1500,
          transform: `translateY(${Math.sin(timelineFrame * 0.045) * 7}px)`,
          opacity: featureP
        }}
      >
        <Sequence from={0} durationInFrames={FEATURE_VOICE_DURATION}>
          <Video src={staticFile('live2d-generated/feature-chat/character.webm')} muted />
          <Audio volume={1.3} src={staticFile('live2d-generated/feature-chat/voice.wav')} />
        </Sequence>
      </div>
    </AbsoluteFill>
  )
}
