import React from 'react'
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { Video } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { StripedStage, usePop } from '../fx'
import { WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// 由 scripts/create-live2d-asset.mjs 生成的素材，时长以 source.json 为准。
export const DIARY_ASSET = {
  name: 'diary-secret',
  durationInFrames: 278
}

const TABS = [
  { icon: ICONS.book as IconDefinition, label: '日记', src: 'video/clips/diary.mp4', start: 0 },
  {
    icon: ICONS.house as IconDefinition,
    label: '主页 · 状态',
    src: 'video/clips/home.mp4',
    start: 130
  }
]

const STATUS = [
  { icon: ICONS.book, label: '日记本', delay: 150 },
  { icon: ICONS.terminal, label: '运行日志', delay: 172 },
  { icon: ICONS.heartPulse, label: '服务状态', delay: 194 }
]

const TAB_DURATIONS = [130, 160]
const TAB_FADE = 8

const tabVideoOpacity = (frame: number, index: number): number => {
  const start = TABS[index].start
  const duration = TAB_DURATIONS[index]
  const local = frame - start
  const inP = interpolate(local, [0, TAB_FADE], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const outP = interpolate(local, [duration - TAB_FADE, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  return Math.max(0, Math.min(inP, outP))
}

export const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame()
  const active = frame < TABS[1].start ? 0 : 1
  const tabP = usePop(frame, TABS[1].start)

  return (
    <AbsoluteFill>
      <StripedStage />

      {/* 场景内的小标签：她的日记本。 */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 96,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 10px 24px -10px ${COLORS.pinkShadow}`,
          fontFamily: FONT.sanJi,
          fontSize: 24,
          fontWeight: 700,
          color: COLORS.textDark
        }}
      >
        <Icon icon={ICONS.book} size={26} color={COLORS.pinkDark} />
        她的日记本
      </div>

      {/* 日记窗口：她自己的本子，翻页给你看一眼。 */}
      <div style={{ position: 'absolute', left: 150, top: 230 }}>
        <WindowFrame width={760} height={520} title="智乃的日记" popDelay={26}>
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
                gap: 12,
                padding: '12px 20px',
                borderBottom: `1.5px solid ${COLORS.pinkPale}`,
                background: '#fff8fa',
                flexShrink: 0
              }}
            >
              {TABS.map((t, i) => {
                const isActive = i === active
                const activeScale = isActive
                  ? `scale(${0.94 + 0.06 * (i === 0 ? 1 : tabP)})`
                  : undefined
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 20px',
                      borderRadius: 999,
                      fontFamily: FONT.sanJi,
                      fontSize: 21,
                      fontWeight: 700,
                      color: isActive ? COLORS.white : COLORS.textGray,
                      background: isActive
                        ? `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkDark})`
                        : 'rgba(255,255,255,0.9)',
                      border: `2px solid ${isActive ? 'transparent' : COLORS.pinkPale}`,
                      transform: activeScale
                    }}
                  >
                    <Icon
                      icon={t.icon}
                      size={19}
                      color={isActive ? COLORS.white : COLORS.pinkDark}
                    />
                    {t.label}
                  </div>
                )
              })}
            </div>
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              {TABS.map((t, i) => (
                <Sequence key={t.label} from={t.start} durationInFrames={TAB_DURATIONS[i]}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: tabVideoOpacity(frame, i)
                    }}
                  >
                    <Video
                      src={staticFile(t.src)}
                      muted
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </Sequence>
              ))}
            </div>
          </div>
        </WindowFrame>
      </div>

      {/* 她的状态：日记本 / 运行日志 / 服务状态。 */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 20
        }}
      >
        {STATUS.map((s, i) => {
          const p = usePop(frame, s.delay)
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 22px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.94)',
                border: `2px solid ${COLORS.pinkPale}`,
                boxShadow: `0 12px 28px -12px ${COLORS.pinkShadow}`,
                fontFamily: FONT.sanJi,
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.textDark,
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`
              }}
            >
              <Icon icon={s.icon} size={24} color={COLORS.pinkDark} />
              {s.label}
            </div>
          )
        })}
      </div>

      {/* 智乃本尊：护着自己的日记，不给你偷看。 */}
      <CharacterClip
        name={DIARY_ASSET.name}
        durationInFrames={DIARY_ASSET.durationInFrames}
        voiceVolume={0.96}
        style={{
          right: -300,
          top: -90,
          width: 1300,
          height: 1300
        }}
      />
    </AbsoluteFill>
  )
}
