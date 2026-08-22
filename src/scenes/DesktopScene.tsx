import React from 'react'
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion'
import { Video } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { FeatureChip, SceneTitle, WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'

const WIDGETS = [
  { icon: ICONS.clock, label: '时钟日历' },
  { icon: ICONS.cloudSun, label: '天气' },
  { icon: ICONS.quote, label: '每日一句' },
  { icon: ICONS.listCheck, label: '任务板' },
  { icon: ICONS.noteSticky, label: '便签' }
]

export const DesktopScene: React.FC = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#ffeef4" to="#ffd9e4" sparkleSeed={29} />
      <SceneTitle
        delay={8}
        sub="她待在桌边，空白留给你"
        icon={<Icon icon={ICONS.laptop} size={54} color={COLORS.pinkDark} />}
      >
        把智乃放在你看得见的地方
      </SceneTitle>

      <div
        style={{
          position: 'absolute',
          top: 235,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 22
        }}
      >
        <FeatureChip
          label="拖动定位"
          icon={<Icon icon={ICONS.drag} size={26} color={COLORS.pink} />}
          delay={40}
          size={24}
        />
        <FeatureChip
          label="点击穿透"
          icon={<Icon icon={ICONS.ghost} size={26} color={COLORS.pink} />}
          delay={62}
          size={24}
        />
        <FeatureChip
          label="浮动工具栏"
          icon={<Icon icon={ICONS.toolbox} size={26} color={COLORS.pink} />}
          delay={84}
          size={24}
        />
      </div>

      <div style={{ position: 'absolute', left: 210, top: 335 }}>
        <WindowFrame width={640} height={420} title="待办列表" popDelay={90}>
          <Video
            src={staticFile('video/clips/todo.mp4')}
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

      <div style={{ position: 'absolute', right: 210, top: 335 }}>
        <WindowFrame width={640} height={420} title="天气查询" popDelay={110}>
          <Video
            src={staticFile('video/clips/weather.mp4')}
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

      <div
        style={{
          position: 'absolute',
          bottom: 108,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 22
        }}
      >
        {WIDGETS.map((w, i) => {
          const p = usePop(frame, 170 + i * 16)
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 24px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.94)',
                border: `2px solid ${COLORS.pinkPale}`,
                boxShadow: `0 12px 28px -12px ${COLORS.pinkShadow}`,
                fontFamily: FONT.sanJi,
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.textDark,
                opacity: p,
                transform: `translateY(${(1 - p) * 22}px)`
              }}
            >
              <Icon icon={w.icon} size={28} color={COLORS.pinkDark} />
              {w.label}
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
