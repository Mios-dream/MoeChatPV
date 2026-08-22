import React from 'react'
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion'
import { Video } from '@remotion/media'
import { COLORS, FONT } from '../theme'
import { SceneBackground, usePop } from '../fx'
import { FeatureChip, SceneTitle, WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'

export const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <SceneBackground from="#fffdfe" via="#fff0f6" to="#ffd9e6" sparkleSeed={15} />
      <SceneTitle
        delay={8}
        sub="功能持续进化中，更多惊喜在路上"
        icon={<Icon icon={ICONS.book} size={54} color={COLORS.pinkDark} />}
      >
        更多玩法
      </SceneTitle>

      <div style={{ position: 'absolute', left: 210, top: 300 }}>
        <WindowFrame width={640} height={430} title="日记功能" popDelay={40}>
          <Video
            src={staticFile('video/clips/diary.mp4')}
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

      <div style={{ position: 'absolute', right: 210, top: 300 }}>
        <WindowFrame width={640} height={430} title="主页 · 日志 · 服务状态" popDelay={60}>
          <Video
            src={staticFile('video/clips/home.mp4')}
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
          bottom: 150,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 22
        }}
      >
        <FeatureChip
          label="日记本"
          icon={<Icon icon={ICONS.book} size={26} color={COLORS.pink} />}
          delay={130}
          size={24}
        />
        <FeatureChip
          label="运行日志"
          icon={<Icon icon={ICONS.terminal} size={26} color={COLORS.pink} />}
          delay={152}
          size={24}
        />
        <FeatureChip
          label="服务状态"
          icon={<Icon icon={ICONS.heartPulse} size={26} color={COLORS.pink} />}
          delay={174}
          size={24}
        />
      </div>
    </AbsoluteFill>
  )
}
