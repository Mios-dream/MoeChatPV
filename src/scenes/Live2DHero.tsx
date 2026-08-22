import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame
} from 'remotion'
import { Audio, Video } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { SceneBackground, useFade, usePop } from '../fx'
import { FeatureChip, WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'

const TABS = [
  { icon: ICONS.comments, label: '聊天', start: 0 },
  { icon: ICONS.listCheck, label: '待办', start: 108 },
  { icon: ICONS.cloudSun, label: '天气', start: 216 },
  { icon: ICONS.book, label: '日记', start: 324 }
]

const TAB_VIDEOS = [
  'video/clips/chat.mp4',
  'video/clips/todo.mp4',
  'video/clips/weather.mp4',
  'video/clips/diary.mp4'
]

const SHOWCASE_DURATION = 308
const FEATURE_START = 320
const FEATURE_VOICE_DURATION = 368

type PortraitShotProps = {
  from: number
  to: number
  label?: string
  title?: string
  detail?: string
  imageY: number
  imageScale: number
  imageX?: number
}

const PortraitShot: React.FC<PortraitShotProps> = ({
  from,
  to,
  imageY,
  imageScale,
  imageX = 0
}) => {
  const frame = useCurrentFrame()
  const duration = to - from
  const local = frame - from
  const fadeIn = interpolate(local, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const fadeOut = interpolate(local, [duration - 14, duration], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const opacity = Math.min(fadeIn, fadeOut)
  const camera = interpolate(local, [0, duration], [0.98, 1.05], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
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
          inset: 0
          // background:
          //   'radial-gradient(circle at 70% 48%, rgba(255,255,255,0.18), transparent 34%), linear-gradient(132deg, #171525 0%, #2c233c 47%, #72536e 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.24
          // background:
          //   'repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 46px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1120,
          height: 1680,
          transform: `translate(calc(-50% + ${imageX}px), calc(-50% + ${imageY}px)) scale(${imageScale * camera})`,
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
  const introP = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const introOut = interpolate(frame, [96, 118], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const opacity = Math.min(introP, introOut)
  const imageY = interpolate(frame, [0, 118], [28, -12], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2
          // background:
          //   'repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 46px)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 500,
          width: 700,
          zIndex: 3,
          opacity,
          transform: `translateY(${(1 - introP) * 28}px)`
        }}
      >
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT.kaTong,
            fontSize: 170,
            lineHeight: 1,
            color: '#FFA8C5',
            // transform: 'rotate(20deg)',
            textShadow: '10px 10px 5px rgba(255,255,255,1)'
          }}
        >
          香风智乃
        </div>
        {/* <div
          style={{
            marginTop: 28,
            width: 560,
            fontFamily: FONT.sanJi,
            fontSize: 34,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.94)',
            fontWeight: 700
          }}
        >
          温柔又可靠的桌面伙伴
        </div> */}
        {/* <div
          style={{
            marginTop: 20,
            width: 560,
            fontFamily: FONT.sanJi,
            fontSize: 25,
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.68)'
          }}
        >
          她会陪你聊天、记录心情，也会用声音和表情回应每一次互动。
        </div> */}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 100,
          top: 88,
          width: 1500,
          height: 'auto',
          zIndex: 2,
          transform: `translateY(${imageY}px)`,
          filter: 'drop-shadow(0 28px 34px rgba(250,250,250,0.9))'
        }}
      >
        <Img
          src={staticFile('images/智乃立绘.png')}
          style={{
            position: 'absolute',
            left: 0,
            top: -24,
            width: '100%',
            height: 'auto',
            objectFit: 'fill'
          }}
        />
      </div>
      <Audio src={staticFile('live2d-generated/greeting/voice.wav')} volume={0.96} />
    </div>
  )
}

const CharacterShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <PortraitShot from={0} to={66} imageY={-1000} imageScale={2} />
      <PortraitShot from={54} to={130} imageY={0} imageX={-200} imageScale={2} />
      <PortraitShot from={118} to={196} imageY={1200} imageX={-200} imageScale={2} />
      <Sequence from={190} durationInFrames={SHOWCASE_DURATION - 190} premountFor={12}>
        <CharacterIntro />
      </Sequence>
    </AbsoluteFill>
  )
}

const DialogueBubble: React.FC<{
  children: React.ReactNode
  opacity: number
  accent?: string
}> = ({ children, opacity, accent = COLORS.pinkDark }) => (
  <div
    style={{
      padding: '20px 32px',
      borderRadius: 28,
      borderTopRightRadius: 10,
      background: 'rgba(255,255,255,0.96)',
      border: `2.5px solid ${COLORS.pinkPale}`,
      boxShadow: `0 18px 44px -16px ${COLORS.pinkShadow}`,
      fontFamily: FONT.sanJi,
      fontSize: 31,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.45,
      opacity
    }}
  >
    {children}
    <span style={{ color: accent }}>。</span>
  </div>
)

export const Live2DHero: React.FC = () => {
  const frame = useCurrentFrame()
  const featureP = usePop(frame, FEATURE_START, 34)
  const featureVoiceP = Math.min(
    useFade(frame, FEATURE_START + 22, 24),
    interpolate(
      frame,
      [FEATURE_START + FEATURE_VOICE_DURATION - 34, FEATURE_START + FEATURE_VOICE_DURATION],
      [1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    )
  )
  const activeTab =
    frame < FEATURE_START + TABS[1].start
      ? 0
      : frame < FEATURE_START + TABS[2].start
        ? 1
        : frame < FEATURE_START + TABS[3].start
          ? 2
          : 3
  const panelP = usePop(frame, FEATURE_START + 12, 34)

  return (
    <AbsoluteFill>
      <SceneBackground
        from="#fffafc"
        via="#ffe9f0"
        to="#ffd0df"
        hearts={false}
        sparkleSeed={61}
        blobs={false}
        ribbons={false}
      />
      {/* Diagonal stripes echo the character-first reference framing. */}
      <AbsoluteFill
        style={{
          opacity: frame < FEATURE_START ? 0.68 : 0.18,
          background:
            'repeating-linear-gradient(135deg, rgba(255,152,180,0.24) 0 18px, transparent 18px 54px)'
        }}
      />
      {/* Character showcase: three portrait details, then an enlarged Live2D expression shot. */}
      <Sequence from={0} durationInFrames={SHOWCASE_DURATION}>
        <CharacterShowcase />
      </Sequence>
      {/* Feature demo: the product occupies the main two-thirds of the frame. */}
      <Sequence from={FEATURE_START}>
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 72,
            opacity: useFade(frame, FEATURE_START, 26),
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
            角色陪伴，功能随叫随到
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
          <WindowFrame width={1300} height={760} title="MoeChat 功能演示" popDelay={12}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                background: '#fff'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '16px 22px',
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
                        padding: '11px 22px',
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
                      <Icon
                        icon={t.icon}
                        size={22}
                        color={active ? COLORS.white : COLORS.pinkDark}
                      />
                      {t.label}
                    </div>
                  )
                })}
              </div>
              <div style={{ position: 'relative', flex: 1 }}>
                {TAB_VIDEOS.map((src, i) => {
                  const start = TABS[i].start
                  const duration = i === TABS.length - 1 ? 120 : 108
                  return (
                    <Sequence key={i} from={start} durationInFrames={duration}>
                      <Video
                        src={staticFile(src)}
                        muted
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
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
                  {TABS[activeTab].label === '聊天'
                    ? '实时聊天 · 语音 · 表情动作'
                    : TABS[activeTab].label === '待办'
                      ? '让助手帮你制定待办列表'
                      : TABS[activeTab].label === '天气'
                        ? '天气查询，即问即答'
                        : '日记本，记录每一天'}
                </div>
              </div>
            </div>
          </WindowFrame>
          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 18,
              justifyContent: 'center'
            }}
          >
            <FeatureChip
              label="语音识别"
              icon={<Icon icon={ICONS.micLines} size={22} color={COLORS.pink} />}
              delay={42}
              size={21}
            />
            <FeatureChip
              label="表情动作"
              icon={<Icon icon={ICONS.masks} size={22} color={COLORS.pink} />}
              delay={56}
              size={21}
            />
            <FeatureChip
              label="小组件"
              icon={<Icon icon={ICONS.clock} size={22} color={COLORS.pink} />}
              delay={70}
              size={21}
            />
            <FeatureChip
              label="低占用"
              icon={<Icon icon={ICONS.battery} size={22} color={COLORS.pink} />}
              delay={84}
              size={21}
            />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: -300,
            top: 10,
            width: 1200,
            height: 1200,
            transform: `translateY(${Math.sin(frame * 0.045) * 7}px)`,
            opacity: featureP
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden'
            }}
          >
            <Sequence from={0} durationInFrames={FEATURE_VOICE_DURATION}>
              <Video
                src={staticFile('live2d-generated/feature-chat/character.webm')}
                muted
                style={{
                  width: 1200,
                  height: 1200,
                  objectFit: 'contain',
                  rotate: '-0.2deg'
                }}
              />
              <Audio src={staticFile('live2d-generated/feature-chat/voice.wav')} volume={0.9} />
            </Sequence>
            <Sequence from={FEATURE_VOICE_DURATION}>
              <Video
                src={staticFile('live2d-generated/hero-idle/character.webm')}
                loop
                muted
                style={{ width: 1200, height: 1200, objectFit: 'contain' }}
              />
            </Sequence>
          </div>
          <div
            style={{
              position: 'absolute',
              left: -55,
              top: -106,
              width: 610,
              opacity: featureVoiceP,
              transform: `translateY(${(1 - featureVoiceP) * 15}px)`
            }}
          >
            <DialogueBubble opacity={1} accent={COLORS.purple}>
              想聊天、查天气，还是记下今天的心情？告诉我吧
            </DialogueBubble>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  )
}
