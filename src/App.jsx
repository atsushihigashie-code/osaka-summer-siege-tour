import { useState, useRef, useEffect, useCallback } from "react";
import { slides } from "./tourData";
import "./App.css";

const TOTAL = slides.length;
const GRID_HOLD_MS = 900; // how long the full 10-photo grid is shown
const ZOOM_MS = 850; // how long the zoom-in transition takes

export default function App() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  // phase: 'grid' (showing all 10) -> 'zooming' (target expanding) -> 'detail' (normal chapter view)
  const [phase, setPhase] = useState("detail");
  const [pendingIndex, setPendingIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const touchStartX = useRef(null);
  const timers = useRef([]);

  const slide = slides[index];
  const isFirst = index === 0;
  const isLast = index === TOTAL - 1;
  const isTransitioning = phase === "grid" || phase === "zooming";

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  // Shows the full 10-photo grid, then zooms into target index, then reveals detail view.
  const beginChapter = useCallback((target) => {
    if (target < 0 || target >= TOTAL) return;
    clearTimers();
    setPendingIndex(target);
    setAudioError(false);
    setPhase("grid");
    const t1 = setTimeout(() => setPhase("zooming"), GRID_HOLD_MS);
    const t2 = setTimeout(() => {
      setIndex(target);
      setPhase("detail");
    }, GRID_HOLD_MS + ZOOM_MS);
    timers.current = [t1, t2];
  }, []);

  const goNext = useCallback(() => {
    if (isTransitioning) return;
    beginChapter(index + 1);
  }, [beginChapter, index, isTransitioning]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    beginChapter(index - 1);
  }, [beginChapter, index, isTransitioning]);

  const goTo = useCallback(
    (i) => {
      if (isTransitioning) return;
      beginChapter(i);
    },
    [beginChapter, isTransitioning]
  );

  useEffect(() => () => clearTimers(), []);

  // Play narration only once the detail view for that chapter is actually showing.
  useEffect(() => {
    if (!started || phase !== "detail") return;
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    el.load();
    if (playing && !muted) {
      el.play().catch(() => {});
    }
  }, [index, started, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => {
      if (!started) return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, goNext, goPrev]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) goNext();
    if (dx > 50) goPrev();
    touchStartX.current = null;
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().catch(() => {});
      setPlaying(true);
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  if (!started) {
    return (
      <div className="gate">
        <div className="gate-crest" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="crest-svg">
            <circle cx="50" cy="50" r="46" className="crest-ring" />
            <path d="M50 12 L58 42 L88 50 L58 58 L50 88 L42 58 L12 50 L42 42 Z" className="crest-mark" />
          </svg>
        </div>
        <p className="gate-eyebrow">大坂夏の陣 — East River 31</p>
        <h1 className="gate-title">
          1615<br /><span className="gate-title-sub">The Summer Siege of Osaka</span>
        </h1>
        <p className="gate-desc">
          The final clash for the realm, and the tactical archetypes that defined it.
          A ten-part guided story — walk through it at your own pace.
        </p>
        <button
          className="gate-button"
          onClick={() => {
            setStarted(true);
            beginChapter(0);
          }}
        >
          Begin the Tour
        </button>
        <p className="gate-hint">Best experienced with sound on 🔊</p>
      </div>
    );
  }

  const targetIndex = isTransitioning ? pendingIndex : index;

  return (
    <div
      className="tour"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Normal detail view — hidden while the grid/zoom transition plays */}
      <div className={`tour-image-wrap ${isTransitioning ? "wrap-hidden" : ""}`}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`tour-image-layer ${i === index && phase === "detail" ? "active" : ""}`}
            style={{
              backgroundImage: `url(${s.image})`,
              "--zoom-from": s.zoomFrom,
              "--zoom-to": s.zoomTo,
            }}
          />
        ))}
        <div className="tour-scrim" />
      </div>

      {/* Grid overview -> zoom-into-target transition */}
      {isTransitioning && (
        <div className="grid-overlay">
          {slides.map((s, i) => {
            const isTarget = i === targetIndex;
            const box = s.gridBox;
            const zoomed = phase === "zooming" && isTarget;
            const style = {
              backgroundImage: `url(${s.image})`,
              "--tx": `${box.tx}vw`,
              "--ty": `${box.ty}vh`,
              "--sx": box.sx,
              "--sy": box.sy,
            };
            let cls = "grid-thumb";
            if (phase === "zooming") {
              cls += isTarget ? " grid-thumb-zoomed" : " grid-thumb-fade";
            } else if (isTarget) {
              cls += " grid-thumb-highlight";
            }
            return <div key={s.id} className={cls} style={style} />;
          })}
          <div className="grid-scrim" />
          {phase === "grid" && (
            <p className="grid-caption">
              {String(targetIndex + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
            </p>
          )}
        </div>
      )}

      <audio
        ref={audioRef}
        src={slide.audio}
        onError={() => setAudioError(true)}
        onEnded={() => { if (!isLast) goNext(); }}
      />

      <header className="tour-header">
        <div className="tour-header-left">
          <span className="tour-kanji">大坂夏の陣</span>
        </div>
        <div className="tour-progress">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`dot ${i === targetIndex ? "dot-active" : ""} ${i < targetIndex ? "dot-done" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to chapter ${i + 1}`}
            />
          ))}
        </div>
        <div className="tour-header-right">{targetIndex + 1} / {TOTAL}</div>
      </header>

      {phase === "detail" && (
        <div key={slide.id} className="tour-panel">
          <p className="tour-eyebrow">{slide.eyebrow}</p>
          <h2 className="tour-title">{slide.title}</h2>
          <p className="tour-subtitle">{slide.subtitle}</p>
        </div>
      )}

      <div className="tour-controls">
        <button className="ctrl-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? "🔇" : "🔊"}
        </button>
        <button className="ctrl-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? "⏸" : "▶"}
        </button>
        {audioError && phase === "detail" && (
          <span className="ctrl-note">No narration for this scene yet</span>
        )}
      </div>

      <button
        className={`nav-arrow nav-prev ${isFirst || isTransitioning ? "nav-hidden" : ""}`}
        onClick={goPrev}
        aria-label="Previous chapter"
      >
        ‹
      </button>
      <button
        className={`nav-arrow nav-next ${isLast || isTransitioning ? "nav-hidden" : ""}`}
        onClick={goNext}
        aria-label="Next chapter"
      >
        ›
      </button>

      {isLast && phase === "detail" && (
        <div className="tour-end">
          <p className="tour-end-text">The Summer Siege of Osaka, 1615</p>
          <p className="tour-end-sub">The end of one era, the beginning of another.</p>
          <button className="gate-button gate-button-ghost" onClick={() => goTo(0)}>
            Watch Again
          </button>
        </div>
      )}
    </div>
  );
}
