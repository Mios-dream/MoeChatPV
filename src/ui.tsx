import React from "react";
import {
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { COLORS, FONT } from "./theme";
import { popEase, usePop } from "./fx";

export const WindowFrame: React.FC<{
  width: number;
  height: number;
  title: string;
  children: React.ReactNode;
  popDelay?: number;
  float?: boolean;
  scale?: number;
  dotColor?: string;
}> = ({
  width,
  height,
  title,
  children,
  popDelay = 0,
  float = true,
  scale = 1,
  dotColor = COLORS.pink,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(frame, popDelay);
  const bob = float
    ? Math.sin(frame * 0.045) * 8
    : 0;
  return (
    <div
      style={{
        width,
        height,
        opacity: interpolate(pop, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${bob}px) scale(${scale * (0.8 + 0.2 * pop)})`,
        borderRadius: 26,
        background: "rgba(255,255,255,0.92)",
        boxShadow: `0 22px 60px -18px ${COLORS.pinkShadow}, 0 6px 18px -10px rgba(251,114,153,0.25)`,
        border: `2px solid ${COLORS.pinkPale}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT.sanJi,
      }}
    >
      <div
        style={{
          height: 58,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 10,
          background: "rgba(255,255,255,0.85)",
          borderBottom: `1.5px solid ${COLORS.pinkPale}`,
          flexShrink: 0,
        }}
      >
        {[COLORS.pink, COLORS.gold, COLORS.mint].map((c, i) => (
          <div
            key={i}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 21,
            color: COLORS.textDark,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

export const ChatBubble: React.FC<{
  side: "user" | "assistant";
  children: React.ReactNode;
  delay?: number;
}> = ({ side, children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = usePop(frame, delay);
  const isUser = side === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: "0 20px",
        margin: "12px 0",
        opacity: interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      <div
        style={{
          maxWidth: "74%",
          padding: "14px 20px",
          borderRadius: 20,
          borderTopLeftRadius: isUser ? 20 : 8,
          borderTopRightRadius: isUser ? 8 : 20,
          background: isUser
            ? `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkDark})`
            : COLORS.white,
          color: isUser ? COLORS.white : COLORS.textDark,
          fontSize: 25,
          lineHeight: 1.55,
          boxShadow: isUser
            ? "0 10px 24px -8px rgba(249,90,138,0.55)"
            : `0 8px 20px -10px ${COLORS.pinkShadow}`,
          border: isUser ? "none" : `1.5px solid ${COLORS.pinkPale}`,
          fontWeight: 500,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const TypewriterText: React.FC<{
  text: string;
  start: number;
  cps?: number;
  cursor?: boolean;
  cursorColor?: string;
}> = ({ text, start, cps = 9, cursor = true, cursorColor = COLORS.pinkDark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  const visible = text.slice(0, chars);
  const done = chars >= text.length;
  const blink = cursor && !done && Math.sin(frame * 0.35) > -0.3;
  return (
    <span>
      {visible}
      {blink ? (
        <span style={{ color: cursorColor, fontWeight: 700 }}>|</span>
      ) : null}
    </span>
  );
};

export const FeatureChip: React.FC<{
  label: string;
  icon: React.ReactNode;
  delay?: number;
  color?: string;
  size?: number;
}> = ({ label, icon, delay = 0, color = COLORS.pink, size = 26 }) => {
  const frame = useCurrentFrame();
  const p = usePop(frame, delay, 24);
  const bob = Math.sin(frame * 0.05 + delay) * 5;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 26px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.94)",
        border: `2px solid ${COLORS.pinkPale}`,
        boxShadow: `0 12px 30px -12px ${COLORS.pinkShadow}`,
        fontSize: size,
        fontWeight: 700,
        color: COLORS.textDark,
        fontFamily: FONT.sanJi,
        opacity: p,
        transform: `translateY(${bob}px) scale(${0.7 + 0.3 * p})`,
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </div>
  );
};

export const SceneTitle: React.FC<{
  children: React.ReactNode;
  delay?: number;
  sub?: string;
  icon?: React.ReactNode;
}> = ({ children, delay = 0, sub, icon }) => {
  const frame = useCurrentFrame();
  const p = usePop(frame, delay);
  const subP = interpolate(frame, [delay + 12, delay + 34], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        marginTop: 46,
        opacity: p,
        transform: `scale(${0.8 + 0.2 * p})`,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {icon}
        <div
          style={{
            fontFamily: FONT.kaTong,
            fontSize: 64,
            color: COLORS.pinkDark,
            letterSpacing: 3,
            textShadow: `0 6px 24px ${COLORS.pinkShadow}`,
          }}
        >
          {children}
        </div>
        {icon ? <div style={{ width: 56 }} /> : null}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: FONT.sanJi,
            fontSize: 26,
            color: COLORS.textGray,
            opacity: subP,
            transform: `translateY(${(1 - subP) * 16}px)`,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export const RoundedCard: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  delay?: number;
  accent?: string;
  pad?: number;
}> = ({ children, width, height, delay = 0, accent = COLORS.pinkPale, pad = 26 }) => {
  const frame = useCurrentFrame();
  const p = usePop(frame, delay);
  return (
    <div
      style={{
        width,
        height,
        padding: pad,
        borderRadius: 28,
        background: "rgba(255,255,255,0.93)",
        border: `2px solid ${accent}`,
        boxShadow: `0 18px 44px -16px ${COLORS.pinkShadow}`,
        opacity: p,
        transform: `scale(${0.82 + 0.18 * p})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT.sanJi,
      }}
    >
      {children}
    </div>
  );
};

export const Screenshot: React.FC<{
  src: string;
  delay?: number;
  float?: boolean;
}> = ({ src, delay = 0, float = true }) => {
  const frame = useCurrentFrame();
  const p = usePop(frame, delay);
  const bob = float ? Math.sin(frame * 0.04 + delay) * 6 : 0;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 18,
        opacity: p,
        transform: `scale(${0.92 + 0.08 * p}) translateY(${bob}px)`,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: 16,
          boxShadow: "0 10px 30px -12px rgba(0,0,0,0.15)",
          background: "#fff",
        }}
      />
    </div>
  );
};

export const PopText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  perLetter?: boolean;
  gap?: number;
}> = ({
  text,
  delay = 0,
  fontSize = 120,
  fontFamily = FONT.kaTong,
  color = COLORS.pinkDark,
  perLetter = true,
  gap = 3,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap }}>
      {text.split("").map((ch, i) => {
        const p = usePop(frame, delay + i * gap);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily,
              fontSize,
              color,
              textShadow: `0 10px 30px ${COLORS.pinkShadow}`,
              opacity: p,
              transform: `scale(${0.4 + 0.6 * p}) rotate(${(1 - p) * -8}deg)`,
              lineHeight: 1.15,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const AvatarCircle: React.FC<{
  src?: string;
  color?: string;
  size?: number;
  emoji?: string;
}> = ({ src, color = COLORS.pink, size = 64, emoji }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: src ? "transparent" : color,
        border: `3px solid ${COLORS.white}`,
        boxShadow: `0 8px 18px -6px ${COLORS.pinkShadow}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {src ? (
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        emoji
      )}
    </div>
  );
};

export const ProgressBar: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        background: "rgba(255,255,255,0.6)",
        zIndex: 90,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${COLORS.pinkLight}, ${COLORS.pinkDark})`,
          borderRadius: 3,
        }}
      />
    </div>
  );
};
