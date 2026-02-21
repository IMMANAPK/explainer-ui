import { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import { ExplainerVideo } from "./ExplainerVideo/ExplainerVideo";

const LANGUAGES = [
  { label: "Tamil", language: "ta", voice: "ta-IN-ValluvarNeural", font: "Noto Sans Tamil" },
  { label: "Hindi", language: "hi", voice: "hi-IN-MadhurNeural", font: "Noto Sans Devanagari" },
  { label: "English", language: "en", voice: "en-US-GuyNeural", font: "sans-serif" },
  { label: "Telugu", language: "te", voice: "te-IN-MohanNeural", font: "Noto Sans Telugu" },
  { label: "Malayalam", language: "ml", voice: "ml-IN-MidhunNeural", font: "Noto Sans Malayalam" },
  { label: "Arabic", language: "ar", voice: "ar-SA-HamedNeural", font: "Noto Sans Arabic" },
];
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {
  const [tab, setTab] = useState<"generate" | "history">("generate");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [generating, setGenerating] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [message, setMessage] = useState("");
  const [, setVideoUrl] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [videoData, setVideoData] = useState<any>(null);

  const fetchHistory = async () => {
    const res = await fetch(`${API_URL}/video/history`);
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab]);

  const handleGenerate = async () => {
    if (!text.trim()) return alert("Text enter pannu!");
    setGenerating(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/video/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          title: title || text.split(" ").slice(0, 3).join(" "),
          language: selectedLang.language,
          voice: selectedLang.voice,
          font: selectedLang.font,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Video generated! Now click Render MP4.");
        setVideoData(data);
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (e) {
      setMessage("❌ Server connect aagala!");
    }
    setGenerating(false);
  };

  const handleRender = async () => {
    setRendering(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/video/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ MP4 rendered!");
        setVideoUrl(`${API_URL}/output/explainer.mp4?t=${Date.now()}`);
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (e) {
      setMessage("❌ Server error!");
    }
    setRendering(false);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#1a1a2e",
    padding: 40,
    borderRadius: 16,
    width: "100%",
    maxWidth: 700,
    boxShadow: "0 0 30px rgba(42,157,143,0.3)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f0f1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      padding: "40px 20px",
    }}>
      <div style={cardStyle}>
        <h1 style={{ color: "#2a9d8f", textAlign: "center", marginBottom: 24 }}>
          🎬 AI Explainer Video Generator
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: 24, gap: 8 }}>
          {(["generate", "history"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: 10,
              backgroundColor: tab === t ? "#2a9d8f" : "#0f0f1a",
              color: "#fff", border: "1px solid #2a9d8f",
              borderRadius: 8, fontSize: 16, cursor: "pointer",
              fontWeight: tab === t ? "bold" : "normal",
            }}>
              {t === "generate" ? "🎬 Generate" : "📋 History"}
            </button>
          ))}
        </div>

        {/* Generate Tab */}
        {tab === "generate" && (
          <>
            <label style={{ color: "#fff", fontSize: 14 }}>Language:</label>
            <select
              value={selectedLang.language}
              onChange={(e) => setSelectedLang(LANGUAGES.find(l => l.language === e.target.value)!)}
              style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 16, borderRadius: 8, backgroundColor: "#0f0f1a", color: "#fff", border: "1px solid #2a9d8f", fontSize: 16 }}
            >
              {LANGUAGES.map(l => <option key={l.language} value={l.language}>{l.label}</option>)}
            </select>

            <label style={{ color: "#fff", fontSize: 14 }}>Title:</label>
            <input
              type="text" placeholder="Video title..."
              value={title} onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 16, borderRadius: 8, backgroundColor: "#0f0f1a", color: "#fff", border: "1px solid #2a9d8f", fontSize: 16, boxSizing: "border-box" }}
            />

            <label style={{ color: "#fff", fontSize: 14 }}>Content:</label>
            <textarea
              placeholder="Type your paragraph here..."
              value={text} onChange={(e) => setText(e.target.value)} rows={6}
              style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 20, borderRadius: 8, backgroundColor: "#0f0f1a", color: "#fff", border: "1px solid #2a9d8f", fontSize: 16, resize: "vertical", boxSizing: "border-box" }}
            />

            <button onClick={handleGenerate} disabled={generating} style={{
              width: "100%", padding: 14,
              backgroundColor: generating ? "#555" : "#2a9d8f",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 18,
              cursor: generating ? "not-allowed" : "pointer", fontWeight: "bold",
            }}>
              {generating ? "⏳ Generating..." : "🎬 Generate Video"}
            </button>

            <button onClick={handleRender} disabled={rendering} style={{
              width: "100%", padding: 14, marginTop: 12,
              backgroundColor: rendering ? "#555" : "#e76f51",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 18,
              cursor: rendering ? "not-allowed" : "pointer", fontWeight: "bold",
            }}>
              {rendering ? "⏳ Rendering..." : "🎬 Render MP4"}
            </button>

            {message && (
              <p style={{ marginTop: 20, textAlign: "center", color: message.startsWith("✅") ? "#2a9d8f" : "#e76f51", fontSize: 16 }}>
                {message}
              </p>
            )}

            {videoData && (
              <Player
                component={ExplainerVideo}
                inputProps={{
                  title: title,
                  text: text,
                  font: selectedLang.font,
                  audioUrl: videoData.audioUrl,
                  words: videoData.words,
                }}
                durationInFrames={Math.ceil(videoData.duration * 30) + 30}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                style={{
                  width: "100%",
                  marginTop: 20,
                  borderRadius: 12,
                  border: "2px solid #2a9d8f",
                }}
                controls
              />
            )}
          </>
        )}

        {/* History Tab */}
        {tab === "history" && (
          <div>
            {history.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center" }}>No videos yet!</p>
            ) : (
              history.map((v, i) => (
                <div key={i} style={{
                  backgroundColor: "#0f0f1a", padding: 16, borderRadius: 10,
                  marginBottom: 12, border: "1px solid #2a9d8f",
                }}>
                  <p style={{ color: "#2a9d8f", fontWeight: "bold", margin: 0 }}>{v.title}</p>
                  <p style={{ color: "#999", fontSize: 13, margin: "4px 0" }}>
                    {v.language.toUpperCase()} • {v.duration?.toFixed(1)}s • {new Date(v.createdAt).toLocaleString()}
                  </p>
                  <p style={{ color: "#ccc", fontSize: 14, margin: 0 }}>{v.text.slice(0, 80)}...</p>
                </div>
              ))
            )}
            <button onClick={fetchHistory} style={{
              width: "100%", padding: 10, marginTop: 12,
              backgroundColor: "#2a9d8f", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer",
            }}>
              🔄 Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;