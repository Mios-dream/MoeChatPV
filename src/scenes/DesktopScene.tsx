import React from 'react'
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion'
import { Video } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { StripedStage, usePop } from '../fx'
import { WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'

// 由 scripts/create-live2d-asset.mjs 生成的素材，时长以 source.json 为准。
export const NEST_ASSET = {
  name: 'desktop-nest',
  durationInFrames: 336
}

const WIDGETS = [
  { icon: ICONS.clock, label: '时钟日历' },
  { icon: ICONS.cloudSun, label: '天气' },
  { icon: ICONS.quote, label: '每日一句' },
  { icon: ICONS.listCheck, label: '任务板' },
  { icon: ICONS.noteSticky, label: '便签' }
]

const TAGS = [
  { icon: ICONS.drag, label: '可拖动', delay: 130 },
  { icon: ICONS.ghost, label: '点击穿透', delay: 156 },
  { icon: ICONS.toolbox, label: '浮动工具栏', delay: 182 }
]

export const DesktopScene: React.FC = () => {
  const frame = useCurrentFrame()
  const tagP = usePop(frame, 110)

  return (
    <AbsoluteFill>
      <StripedStage />

      {/* 场景内的小标签：她的小窝。 */}
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
        <Icon icon={ICONS.laptop} size={26} color={COLORS.pinkDark} />
        桌边的小窝
      </div>

      {/* 桌宠形态实机：她真的住在桌面角落。 */}
      <div style={{ position: 'absolute', left: 150, top: 240 }}>
        <WindowFrame width={660} height={430} title="桌宠形态" popDelay={30}>
          <Video
            src={staticFile('video/clips/pet.mp4')}
            muted
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              background: '#fff'
            }}
          />
        </WindowFrame>
      </div>

      {/* 她的小摆件：贴着桌面的一圈小组件。 */}
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
        {WIDGETS.map((w, i) => {
          const p = usePop(frame, 165 + i * 14)
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 22px',
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
              <Icon icon={w.icon} size={26} color={COLORS.pinkDark} />
              {w.label}
            </div>
          )
        })}
      </div>

      {/* 智乃本尊：住在桌面角落，不挡阁下干活。 */}
      <CharacterClip
        name={NEST_ASSET.name}
        durationInFrames={NEST_ASSET.durationInFrames}
        voiceVolume={0.96}
        style={{
          right: -300,
          top: -80,
          width: 1320,
          height: 1320
        }}
      />

      {/* 她的小标签：像贴在身边的功能牌，简短、不抢戏。 */}
      <div
        style={{
          position: 'absolute',
          right: 690,
          top: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          opacity: tagP
        }}
      >
        {TAGS.map((t, i) => {
          const p = usePop(frame, t.delay)
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.94)',
                border: `2px solid ${COLORS.pinkPale}`,
                boxShadow: `0 10px 24px -10px ${COLORS.pinkShadow}`,
                fontFamily: FONT.sanJi,
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.textDark,
                opacity: p,
                transform: `translateX(${(1 - p) * 18}px)`
              }}
            >
              <Icon icon={t.icon} size={24} color={COLORS.pink} />
              {t.label}
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
