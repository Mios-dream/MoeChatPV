import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONT } from '../theme'
import { StripedStage, usePop } from '../fx'
import { ChatBubble, WindowFrame } from '../ui'
import { Icon, ICONS } from '../icons'
import { CharacterClip } from '../live2d/CharacterClip'

// 由 scripts/create-live2d-asset.mjs 生成的素材，时长以 source.json 为准。
export const VOICE_ASSET = {
  name: 'voice-listen',
  durationInFrames: 308
}

export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame()
  const noteP = usePop(frame, 150)
  const micP = usePop(frame, 10)

  return (
    <AbsoluteFill>
      <StripedStage />

      {/* 场景内的小标签：像是对话中的状态提示，而不是章节标题。 */}
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
          color: COLORS.textDark,
          opacity: micP
        }}
      >
        <Icon icon={ICONS.micLines} size={26} color={COLORS.pinkDark} />
        在桌边 · 听你说
      </div>

      {/* 对话窗口：一次完整的「你说 → 她回 → 她记下」。 */}
      <div style={{ position: 'absolute', left: 150, top: 250 }}>
        <WindowFrame width={780} height={560} title="和智乃的对话" popDelay={24}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '18px 0',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <ChatBubble side="user" delay={40}>
              周六下午三点，提醒我吃火锅。
            </ChatBubble>
            <ChatBubble side="assistant" delay={78}>
              听见啦～周六的火锅，我已经记在待办里啦，到时间会叫阁下的！
            </ChatBubble>
          </div>
        </WindowFrame>
      </div>

      {/* 她说「记好了」时，待办像她的笔记一样出现在手边。 */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          bottom: 195,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '18px 28px',
          borderRadius: 22,
          background: 'rgba(255,255,255,0.95)',
          border: `2px solid ${COLORS.pinkPale}`,
          boxShadow: `0 16px 38px -14px ${COLORS.pinkShadow}`,
          fontFamily: FONT.sanJi,
          opacity: noteP,
          transform: `translateY(${(1 - noteP) * 24}px) scale(${0.88 + 0.12 * noteP})`
        }}
      >
        <Icon icon={ICONS.noteSticky} size={34} color={COLORS.pinkDark} />
        <div>
          <div
            style={{
              fontSize: 22,
              color: COLORS.textGray,
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}
          >
            <span>周六</span>
            <span>15:00</span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: COLORS.mint,
                fontWeight: 700
              }}
            >
              <Icon icon={ICONS.check} size={20} color={COLORS.mint} />
              已加入待办
            </span>
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: 700,
              color: COLORS.textDark,
              marginTop: 2
            }}
          >
            和朋友吃火锅
          </div>
        </div>
      </div>

      {/* 智乃本尊：听见、回应、点头。 */}
      <CharacterClip
        name={VOICE_ASSET.name}
        durationInFrames={VOICE_ASSET.durationInFrames}
        voiceVolume={0.96}
        style={{
          right: -280,
          top: -80,
          width: 1280,
          height: 1280
        }}
      />
    </AbsoluteFill>
  )
}
