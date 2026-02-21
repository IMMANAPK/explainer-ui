import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  title: string;
  text: string;
  font: string;
  audioUrl: string;
  words: { word: string; start: number; end: number }[];
}

export const ExplainerVideo = ({ title, text, font, audioUrl, words }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const currentWordIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f1a", fontFamily: `'${font}', sans-serif` }}>
      {/* Audio */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Title */}
      <div style={{
        position: "absolute", top: "8%", width: "100%",
        textAlign: "center", color: "#2a9d8f",
        fontSize: 52, fontWeight: "bold", padding: "0 5%",
      }}>
        {title}
      </div>

      {/* Words */}
      <div style={{
        position: "absolute", top: "30%", left: "8%", right: "8%",
        textAlign: "center", lineHeight: 2,
      }}>
        {words.map((w, i) => (
          <span key={i} style={{
            fontSize: 36,
            color: i === currentWordIndex ? "#f4a261" : "#ffffff",
            fontWeight: i === currentWordIndex ? "bold" : "normal",
            margin: "0 4px",
            transition: "color 0.1s",
          }}>
            {w.word}{" "}
          </span>
        ))}
      </div>

      {/* Avatar */}
      <div style={{
        position: "absolute", bottom: "8%", left: "50%",
        transform: "translateX(-50%)",
      }}>
        <svg width="80" height="120" viewBox="0 0 80 120">
          <circle cx="40" cy="20" r="18" fill="#f4a261" />
          <rect x="20" y="42" width="40" height="50" rx="8" fill="#2a9d8f" />
          <line x1="20" y1="55"
            x2={10 + Math.sin(frame * 0.1) * 8} y2="80"
            stroke="#2a9d8f" strokeWidth="8" strokeLinecap="round" />
          <line x1="60" y1="55"
            x2={70 - Math.sin(frame * 0.1) * 8} y2="80"
            stroke="#2a9d8f" strokeWidth="8" strokeLinecap="round" />
          <line x1="30" y1="92" x2="28" y2="118" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round" />
          <line x1="50" y1="92" x2="52" y2="118" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};