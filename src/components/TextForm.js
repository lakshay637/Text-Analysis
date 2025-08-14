import React, { useState, useRef, useEffect, useCallback, memo } from "react";

// Language options with ISO codes and readable names
const LANGUAGES = [
  { code: "hi", name: "Hindi" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "gu", name: "Gujarati" },
  { code: "pa", name: "Punjabi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "bn", name: "Bengali" },
  { code: "ur", name: "Urdu" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "tr", name: "Turkish" },
  { code: "ko", name: "Korean" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "ro", name: "Romanian" },
  { code: "uk", name: "Ukrainian" },
  { code: "el", name: "Greek" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
];

// Optimized Whiteboard component with memo
const Whiteboard = memo(({ isFullscreen, onToggleFullscreen, mode }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#2563eb");
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState("pen");
  const [isMobile, setIsMobile] = useState(false);

  const colors = [
    "#2563eb", "#dc2626", "#059669", "#d97706", "#7c3aed",
    "#0891b2", "#be185d", "#374151", "#ea580c", "#6b7280",
    "#1f2937", "#991b1b", "#065f46", "#92400e", "#581c87"
  ];

  // Effect: size canvas and scale for Hi-DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();

      const cssWidth = isFullscreen ? window.innerWidth : rect.width;
      const cssHeight = isFullscreen ? (window.innerHeight - 100) : 400;

      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);

      canvas.style.width = isFullscreen ? "100vw" : "100%";
      canvas.style.height = isFullscreen ? "calc(100vh - 100px)" : "400px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.imageSmoothingEnabled = true;
    };

    updateCanvasSize();
    const resizeHandler = () => {
      requestAnimationFrame(updateCanvasSize);
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [isFullscreen]);

  // Effect: detect mobile breakpoint
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCoordinates = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();

    const { x, y } = getCoordinates(e.clientX, e.clientY);
    const ctx = canvasRef.current.getContext("2d");
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getCoordinates]);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const { x, y } = getCoordinates(e.clientX, e.clientY);
    const ctx = canvasRef.current.getContext("2d");

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [isDrawing, tool, brushSize, currentColor, getCoordinates]);

  const handlePointerUp = useCallback((e) => {
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch (err) {}
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `whiteboard-${new Date().toISOString().split("T")[0]}.png`;
    link.click();
  }, []);

  const containerStyle = {
    position: isFullscreen ? "fixed" : "relative",
    top: isFullscreen ? 0 : "auto",
    left: isFullscreen ? 0 : "auto",
    width: isFullscreen ? "100vw" : "100%",
    height: isFullscreen ? "100vh" : "450px",
    zIndex: isFullscreen ? 9999 : 1,
    background: isFullscreen
      ? (mode === "dark" ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)")
      : (mode === "dark" ? "#1e293b" : "#ffffff"),
    borderRadius: isFullscreen ? 0 : "24px",
    overflow: "hidden",
    boxShadow: isFullscreen ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: isFullscreen ? "none" : `2px solid ${mode === "dark" ? "#334155" : "#e2e8f0"}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  };

  const toolbarStyle = {
    position: "absolute",
    top: isFullscreen ? "20px" : "16px",
    left: isFullscreen ? "20px" : "16px",
    right: isFullscreen ? "20px" : "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: mode === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
    padding: isMobile ? "12px 16px" : "16px 24px",
    borderRadius: "20px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    backdropFilter: "blur(16px)",
    border: `1px solid ${mode === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
    zIndex: 10,
    flexWrap: isMobile ? "wrap" : "nowrap",
    gap: isMobile ? "12px" : "20px"
  };

  const buttonStyle = (isActive = false, color = "#3b82f6") => ({
    padding: isMobile ? "10px 14px" : "12px 18px",
    border: "none",
    borderRadius: "14px",
    background: isActive ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` : (mode === "dark" ? "rgba(51, 65, 85, 0.8)" : "rgba(248, 250, 252, 0.8)"),
    color: isActive ? "white" : (mode === "dark" ? "#e2e8f0" : "#334155"),
    cursor: "pointer",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: "600",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isActive ? `0 8px 25px -8px ${color}66` : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transform: isActive ? "translateY(-1px)" : "none",
    border: `1px solid ${isActive ? "transparent" : (mode === "dark" ? "rgba(148,163,184,0.2)" : "rgba(0,0,0,0.1)")}`
  });

  return (
    <div style={containerStyle}>
      <div style={toolbarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px", flexWrap: isMobile ? "wrap" : "nowrap", flex: 1 }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setTool("pen")} style={buttonStyle(tool === "pen", "#3b82f6")}>
              ✏️ {!isMobile && "Pen"}
            </button>
            <button onClick={() => setTool("eraser")} style={buttonStyle(tool === "eraser", "#ef4444")}>
              🧹 {!isMobile && "Eraser"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            {!isMobile && <span style={{ fontSize: "13px", fontWeight: "600", color: mode === "dark" ? "#94a3b8" : "#64748b", marginRight: "4px" }}>Colors:</span>}
            {colors.slice(0, isMobile ? 8 : 12).map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                style={{
                  width: isMobile ? "28px" : "32px",
                  height: isMobile ? "28px" : "32px",
                  borderRadius: "50%",
                  border: currentColor === color ? `3px solid ${mode === "dark" ? "#e2e8f0" : "#334155"}` : "2px solid rgba(0,0,0,0.1)",
                  background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: currentColor === color ? "scale(1.1)" : "scale(1)",
                  boxShadow: currentColor === color ? `0 8px 25px -8px ${color}66` : "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
            ))}
          </div>

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "120px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: mode === "dark" ? "#94a3b8" : "#64748b" }}>Size:</span>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={brushSize} 
                onChange={(e) => setBrushSize(Number(e.target.value))} 
                style={{ width: "60px", accentColor: currentColor }} 
              />
              <span style={{ fontSize: "12px", fontWeight: "700", minWidth: "28px", color: mode === "dark" ? "#e2e8f0" : "#334155" }}>
                {brushSize}px
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {isMobile && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              background: mode === "dark" ? "rgba(51,65,85,0.8)" : "rgba(248,250,252,0.8)", 
              padding: "6px 12px", 
              borderRadius: "12px", 
              border: `1px solid ${mode === "dark" ? "rgba(148,163,184,0.2)" : "rgba(0,0,0,0.1)"}` 
            }}>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>Size:</span>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={brushSize} 
                onChange={(e) => setBrushSize(Number(e.target.value))} 
                style={{ width: "50px", accentColor: currentColor }} 
              />
              <span style={{ fontSize: "11px", fontWeight: "700", minWidth: "24px" }}>{brushSize}</span>
            </div>
          )}
          <button onClick={clearCanvas} style={buttonStyle(false, "#f59e0b")}>
            🗑️ {!isMobile && "Clear"}
          </button>
          <button onClick={downloadImage} style={buttonStyle(false, "#10b981")}>
            💾 {!isMobile && "Save"}
          </button>
          <button onClick={onToggleFullscreen} style={buttonStyle(false, "#8b5cf6")}>
            {isFullscreen ? "🔳" : "🔲"} {!isMobile && (isFullscreen ? "Exit" : "Full")}
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          cursor: tool === "eraser" ? "crosshair" : "crosshair",
          marginTop: isMobile ? "80px" : "88px",
          background: "transparent",
          touchAction: "none",
          width: "100%",
          height: isFullscreen ? "calc(100vh - 100px)" : "362px"
        }}
      />

      <div style={{
        position: "absolute",
        top: isMobile ? "80px" : "88px",
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundImage: `radial-gradient(circle, ${mode === "dark" ? '#334155' : '#e2e8f0'} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        opacity: 0.3,
        pointerEvents: 'none',
        zIndex: -1
      }} />
    </div>
  );
});

// Main TextForm component
export default function TextForm({ mode = "light", heading = "TextUtils", showAlert = () => {} }) {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("hi");
  const [isWhiteboardFullscreen, setIsWhiteboardFullscreen] = useState(false);
  const [activeMode, setActiveMode] = useState("textAnalysis"); // "textAnalysis" or "whiteboard"

  const handleUpClick = useCallback(() => {
    let newText = text.toUpperCase();
    setText(newText);
    showAlert("Converted to uppercase!", "success");
  }, [text, showAlert]);

  const handleLoClick = useCallback(() => {
    let newText = text.toLowerCase();
    setText(newText);
    showAlert("Converted to lowercase!", "success");
  }, [text, showAlert]);

  const handleClearClick = useCallback(() => {
    setText("");
    showAlert("Text cleared!", "success");
  }, [showAlert]);

  const handleOnChange = useCallback((event) => {
    setText(event.target.value);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    showAlert("Copied to clipboard!", "success");
  }, [text, showAlert]);

  const handleExtraSpaces = useCallback(() => {
    let newText = text.split(/\s+/);
    setText(newText.join(" "));
    showAlert("Extra spaces removed!", "success");
  }, [text, showAlert]);

  const handleTranslate = useCallback(async () => {
    if (text.trim().length === 0) return;
    setLoading(true);
    setTranslated("");

    const tryTranslate = async (langPair) => {
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
        );
        const data = await res.json();
        let translation = data.responseData.translatedText;

        if (Array.isArray(data.matches)) {
          const human = data.matches.find(
            (m) =>
              m.id === 0 &&
              m.translation &&
              m.translation.trim() !== "" &&
              m.translation.trim().toLowerCase() !== text.trim().toLowerCase()
          );
          if (human) translation = human.translation;
          if (
            (!human || !translation || translation.trim().toLowerCase() === text.trim().toLowerCase()) &&
            data.matches.length > 0
          ) {
            const alt = data.matches.find(
              (m) =>
                m.translation &&
                m.translation.trim() !== "" &&
                m.translation.trim().toLowerCase() !== text.trim().toLowerCase()
            );
            if (alt) translation = alt.translation;
          }
        }
        return translation;
      } catch (error) {
        return null;
      }
    };

    try {
      let langPair = `en|${targetLang}`;
      let bestTranslation = await tryTranslate(langPair);

      if (
        targetLang === "hi" &&
        (!bestTranslation ||
          bestTranslation.trim() === "" ||
          bestTranslation.trim().toLowerCase() === text.trim().toLowerCase())
      ) {
        bestTranslation = await tryTranslate("en|hi-IN");
      }

      if (
        bestTranslation &&
        bestTranslation.trim() !== "" &&
        bestTranslation.trim().toLowerCase() !== text.trim().toLowerCase()
      ) {
        setTranslated(bestTranslation);
      } else {
        setTranslated("No accurate translation found. Try rephrasing or use simpler English.");
      }
    } catch (e) {
      setTranslated("Translation failed. Please try again.");
    }
    setLoading(false);
  }, [text, targetLang]);

  const handleCopyTranslation = useCallback(() => {
    if (typeof translated === "string" && translated.trim() !== "") {
      navigator.clipboard.writeText(translated);
      showAlert("Translation copied to clipboard!", "success");
    }
  }, [translated, showAlert]);

  const toggleWhiteboardFullscreen = useCallback(() => {
    setIsWhiteboardFullscreen(!isWhiteboardFullscreen);
  }, [isWhiteboardFullscreen]);

  // Optimized styles
  const containerStyle = {
    background: mode === "dark"
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
      : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)",
    minHeight: "100vh",
    fontFamily: "'Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
    padding: "0",
    color: mode === "dark" ? "#f1f5f9" : "#1e293b",
    transition: "all 0.3s ease-in-out"
  };

  const cardStyle = {
    background: mode === "dark"
      ? "rgba(15, 23, 42, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    maxWidth: "1200px",
    width: "100%",
    border: `2px solid ${mode === "dark" ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    backdropFilter: "blur(20px)",
    margin: "32px auto",
    boxShadow: mode === "dark"
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    borderRadius: "32px",
    padding: "32px",
    transition: "all 0.3s ease-in-out"
  };

  const buttonStyles = {
    base: {
      minWidth: "120px",
      fontWeight: "700",
      borderRadius: "16px",
      boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      padding: "14px 24px",
      color: "white",
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
    }
  };

  // Toggle button style
  const toggleButtonStyle = (isActive) => ({
    padding: "14px 28px",
    border: "none",
    borderRadius: "20px",
    background: isActive 
      ? (mode === "dark" ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" : "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)")
      : (mode === "dark" ? "rgba(51, 65, 85, 0.8)" : "rgba(248, 250, 252, 0.8)"),
    color: isActive ? "white" : (mode === "dark" ? "#e2e8f0" : "#334155"),
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isActive ? "0 12px 35px -12px rgba(59, 130, 246, 0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transform: isActive ? "translateY(-2px)" : "none",
    border: `2px solid ${isActive ? "transparent" : (mode === "dark" ? "rgba(148,163,184,0.2)" : "rgba(0,0,0,0.1)")}`
  });

  const responsiveStyles = {
    textarea: {
      width: "100%",
      fontSize: "16px",
      padding: "20px 24px",
      borderRadius: "20px",
      resize: "vertical",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease-in-out",
      fontFamily: "inherit",
      backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.8)" : "#f8fafc",
      color: mode === "dark" ? "#f1f5f9" : "#1e293b",
      border: `2px solid ${mode === "dark" ? '#334155' : '#e2e8f0'}`
    },
    header: {
      fontWeight: "900",
      letterSpacing: "-0.025em",
      fontSize: "clamp(2rem, 6vw, 4rem)",
      color: mode === "dark" ? "#f1f5f9" : "#0f172a",
      textShadow: mode === "dark" ? "0 0 40px rgba(59, 130, 246, 0.3)" : "0 0 40px rgba(0, 0, 0, 0.1)",
      background: mode === "dark"
        ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
        : "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "16px"
    }
  };

  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const readTime = (0.008 * wordCount).toFixed(2);

  return (
    <div style={containerStyle}>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
        <div style={cardStyle}>
          <header style={{ marginBottom: "40px", textAlign: "center" }}>
            <h3 style={{ color: "#176ee7ff", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", margin: "8px 0 0 0", fontWeight: "900" }}>{heading}</h3>
            <p style={{
              color: mode === "dark" ? "#94a3b8" : "#475569",
              fontWeight: "600",
              fontSize: "clamp(1rem, 3vw, 1.25rem)",
              marginBottom: "32px",
              letterSpacing: "0.025em"
            }}>
              <span style={{ fontSize: "1.5em" }}></span> Professional Text Analysis & Creative Whiteboard
            </p>

            {/* Mode Toggle Buttons */}
            <div style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "24px",
              padding: "8px",
              background: mode === "dark" ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
              borderRadius: "24px",
              border: `1px solid ${mode === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(0, 0, 0, 0.05)"}`
            }}>
              <button
                onClick={() => setActiveMode("textAnalysis")}
                style={toggleButtonStyle(activeMode === "textAnalysis")}
              >
                📝 Text Analysis
              </button>
              <button
                onClick={() => setActiveMode("whiteboard")}
                style={toggleButtonStyle(activeMode === "whiteboard")}
              >
                🎨 Whiteboard
              </button>
            </div>
          </header>

          {/* Text Analysis Mode */}
          {activeMode === "textAnalysis" && (
            <div style={{ 
              animation: "fadeIn 0.5s ease-in-out"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: window.innerWidth > 1024 ? "2fr 1fr" : "1fr", gap: "40px" }}>
                  <div>
                    <div style={{ marginBottom: "24px" }}>
                      <textarea
                        value={text}
                        id="myBox"
                        rows={8}
                        onChange={handleOnChange}
                        style={responsiveStyles.textarea}
                        placeholder="✍️ Type or paste your text here to get started..."
                      />
                    </div>

                    <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                      <label htmlFor="langSelect" style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        color: mode === "dark" ? "#f1f5f9" : "#1e293b"
                      }}>
                        🌐 Translate to:
                      </label>
                      <select
                        id="langSelect"
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        style={{
                          width: "220px",
                          fontWeight: "600",
                          fontSize: "15px",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          border: `2px solid ${mode === "dark" ? '#334155' : '#e2e8f0'}`,
                          background: mode === "dark" ? "rgba(15, 23, 42, 0.8)" : "#ffffff",
                          color: mode === "dark" ? "#f1f5f9" : "#1e293b"
                        }}
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={text.length === 0 || loading}
                        onClick={handleTranslate}
                        style={{
                          ...buttonStyles.base,
                          background: loading ? "#94a3b8" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          opacity: text.length === 0 || loading ? 0.6 : 1
                        }}
                      >
                        {loading ? "🔄 Translating..." : "🚀 Translate"}
                      </button>
                    </div>

                    {translated && (
                      <div style={{
                        borderRadius: "20px",
                        fontSize: "16px",
                        background: mode === "dark"
                          ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
                          : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                        border: `2px solid ${mode === "dark" ? '#334155' : '#cbd5e1'}`,
                        padding: "20px 24px",
                        margin: "16px 0",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}>
                        <strong style={{
                          color: mode === "dark" ? "#3b82f6" : "#1e40af",
                          fontSize: "17px"
                        }}>
                          Translation:
                        </strong>
                        <div style={{ marginTop: "12px", wordBreak: "break-word", color: mode === "dark" ? "#f1f5f9" : "#1e293b", lineHeight: "1.6" }}>
                          {translated}
                        </div>
                        {typeof translated === "string" && translated.trim() !== "" && (
                          <button onClick={handleCopyTranslation} style={{
                            ...buttonStyles.base,
                            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            marginTop: "16px",
                            minWidth: "auto",
                            padding: "10px 20px",
                            fontSize: "13px"
                          }}>
                            📋 Copy Translation
                          </button>
                        )}
                      </div>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                      <button 
                        disabled={text.length === 0} 
                        onClick={handleUpClick} 
                        style={{ 
                          ...buttonStyles.base, 
                          background: text.length === 0 ? "#94a3b8" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
                          opacity: text.length === 0 ? 0.6 : 1,
                          minWidth: "auto",
                          padding: "12px 20px"
                        }}
                      >
                        🔠 Uppercase
                      </button>
                      <button 
                        disabled={text.length === 0} 
                        onClick={handleLoClick} 
                        style={{ 
                          ...buttonStyles.base, 
                          background: text.length === 0 ? "#94a3b8" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
                          opacity: text.length === 0 ? 0.6 : 1,
                          minWidth: "auto",
                          padding: "12px 20px"
                        }}
                      >
                        🔡 Lowercase
                      </button>
                      <button 
                        disabled={text.length === 0} 
                        onClick={handleClearClick} 
                        style={{ 
                          ...buttonStyles.base, 
                          background: text.length === 0 ? "#94a3b8" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", 
                          opacity: text.length === 0 ? 0.6 : 1,
                          minWidth: "auto",
                          padding: "12px 20px"
                        }}
                      >
                        🧹 Clear Text
                      </button>
                      <button 
                        disabled={text.length === 0} 
                        onClick={handleCopy} 
                        style={{ 
                          ...buttonStyles.base, 
                          background: text.length === 0 ? "#94a3b8" : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", 
                          opacity: text.length === 0 ? 0.6 : 1,
                          minWidth: "auto",
                          padding: "12px 20px"
                        }}
                      >
                        📋 Copy Text
                      </button>
                      <button 
                        disabled={text.length === 0} 
                        onClick={handleExtraSpaces} 
                        style={{ 
                          ...buttonStyles.base, 
                          background: text.length === 0 ? "#94a3b8" : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", 
                          opacity: text.length === 0 ? 0.6 : 1,
                          minWidth: "auto",
                          padding: "12px 20px"
                        }}
                      >
                        🚫 Remove Spaces
                      </button>
                    </div>
                  </div>

                  {window.innerWidth > 1024 && (
                    <div>
                      <div style={{
                        borderRadius: "24px",
                        background: mode === "dark" ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        border: `2px solid ${mode === "dark" ? '#334155' : '#e2e8f0'}`,
                        padding: "24px",
                        marginBottom: "24px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}>
                        <h5 style={{ fontWeight: "800", fontSize: "20px", color: mode === "dark" ? "#f1f5f9" : "#1e293b", marginBottom: "20px" }}>
                          📊 Text Statistics
                        </h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <p style={{ margin: 0, color: mode === "dark" ? "#cbd5e1" : "#475569", fontSize: "16px" }}>
                            ✍️ <strong>{wordCount}</strong> words
                          </p>
                          <p style={{ margin: 0, color: mode === "dark" ? "#cbd5e1" : "#475569", fontSize: "16px" }}>
                            🔢 <strong>{text.length}</strong> characters
                          </p>
                          <p style={{ margin: 0, color: mode === "dark" ? "#cbd5e1" : "#475569", fontSize: "16px" }}>
                            ⏱️ <strong>{readTime}</strong> min read
                          </p>
                        </div>
                      </div>

                      <div style={{
                        borderRadius: "24px",
                        background: mode === "dark" ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        border: `2px solid ${mode === "dark" ? '#334155' : '#e2e8f0'}`,
                        padding: "24px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}>
                        <h5 style={{ fontWeight: "800", fontSize: "20px", color: mode === "dark" ? "#f1f5f9" : "#1e293b", marginBottom: "16px" }}>
                          👀 Live Preview
                        </h5>
                        <div style={{
                          minHeight: "120px",
                          color: mode === "dark" ? "#cbd5e1" : "#475569",
                          fontSize: "16px",
                          wordBreak: "break-word",
                          lineHeight: "1.6",
                          padding: "16px",
                          background: mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)",
                          borderRadius: "16px",
                          border: `1px solid ${mode === "dark" ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
                        }}>
                          {text.length > 0 ? text : (
                            <span style={{ color: mode === "dark" ? "#64748b" : "#94a3b8", fontStyle: "italic" }}>
                              Your text preview will appear here...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Statistics - Show below main content on mobile */}
                {window.innerWidth <= 1024 && (
                  <div style={{
                    borderRadius: "24px",
                    background: mode === "dark" ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: `2px solid ${mode === "dark" ? '#334155' : '#e2e8f0'}`,
                    padding: "24px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}>
                    <h5 style={{ fontWeight: "800", fontSize: "20px", color: mode === "dark" ? "#f1f5f9" : "#1e293b", marginBottom: "20px" }}>
                      📊 Text Statistics
                    </h5>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
                      <div style={{ textAlign: "center", padding: "16px", background: mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)", borderRadius: "16px" }}>
                        <div style={{ fontSize: "24px", fontWeight: "900", color: mode === "dark" ? "#3b82f6" : "#1e40af" }}>{wordCount}</div>
                        <div style={{ fontSize: "14px", color: mode === "dark" ? "#cbd5e1" : "#475569" }}>Words</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "16px", background: mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)", borderRadius: "16px" }}>
                        <div style={{ fontSize: "24px", fontWeight: "900", color: mode === "dark" ? "#10b981" : "#059669" }}>{text.length}</div>
                        <div style={{ fontSize: "14px", color: mode === "dark" ? "#cbd5e1" : "#475569" }}>Characters</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "16px", background: mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)", borderRadius: "16px" }}>
                        <div style={{ fontSize: "24px", fontWeight: "900", color: mode === "dark" ? "#f59e0b" : "#d97706" }}>{readTime}</div>
                        <div style={{ fontSize: "14px", color: mode === "dark" ? "#cbd5e1" : "#475569" }}>Min Read</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Whiteboard Mode */}
          {activeMode === "whiteboard" && (
            <div style={{ 
              animation: "fadeIn 0.5s ease-in-out"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div>
                  <h3 style={{ color: "#16686eff", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", margin: "8px 0 0 0", fontWeight: "900" }}>
                    🎨 Creative Whiteboard
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "16px", margin: "8px 0 0 0", fontWeight: "500" }}>
                    Express your ideas with professional drawing tools
                  </p>
                </div>
              </div>

              <Whiteboard
                isFullscreen={isWhiteboardFullscreen}
                onToggleFullscreen={toggleWhiteboardFullscreen}
                mode={mode}
              />
            </div>
          )}
        </div>

        {/* Add custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Smooth transitions for responsive grid */
          @media (max-width: 1024px) {
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
          }
          
          /* Focus styles for accessibility */
          button:focus,
          input:focus,
          textarea:focus,
          select:focus {
            outline: 2px solid ${mode === "dark" ? "#3b82f6" : "#2563eb"};
            outline-offset: 2px;
          }
          
          /* Hover effects */
          button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 12px 35px -8px rgba(0, 0, 0, 0.4);
          }
          
          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${mode === "dark" ? "#1e293b" : "#f1f5f9"};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${mode === "dark" ? "#475569" : "#94a3b8"};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${mode === "dark" ? "#64748b" : "#64748b"};
          }
        `}</style>
      </div>
    </div>
  );
}