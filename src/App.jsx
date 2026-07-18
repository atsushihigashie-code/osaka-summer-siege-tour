import { useState, useRef, useEffect, useCallback } from "react";
import { slides } from "./tourData";
import "./App.css";

const TOTAL = slides.length;

export default function App() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const touchStartX = useRef(null);

  const slide = slides[index];
  const isFirst = index === 0;
  const isLast = index === TOTAL - 1;

  const goTo = useCallback((next) => {
    if (next < 0 || next >= TOTAL) return;
    setIndex(next);
    setAudioError(false);
  }, []);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!started) return;
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    el.load();
    if (playing && !muted) {
      el.play().catch(() => {});
    }
  }, [index, started]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <button className="gate-button" onClick={() => setStarted(true)}>
          Begin the Tour
        </button>
        <p className="gate-hint">Best experienced with sound on 🔊</p>
      </div>
    );
  }

  return (
    <div
      className="tour"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="tour-image-wrap">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`tour-image-layer ${i === index ? "active" : ""}`}
            style={{
              backgroundImage: `url(${s.image})`,
              "--zoom-from": s.zoomFrom,
              "--zoom-to": s.zoomTo,
            }}
          />
        ))}
        <div className="tour-scrim" />
      </div>

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
              className={`dot ${i === index ? "dot-active" : ""} ${i < index ? "dot-done" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to chapter ${i + 1}`}
            />
          ))}
        </div>
        <div className="tour-header-right">{index + 1} / {TOTAL}</div>
      </header>

      <div key={slide.id} className="tour-panel">
        <p className="tour-eyebrow">{slide.eyebrow}</p>
        <h2 className="tour-title">{slide.title}</h2>
        <p className="tour-subtitle">{slide.subtitle}</p>
      </div>

      <div className="tour-controls">
        <button className="ctrl-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? "🔇" : "🔊"}
        </button>
        <button className="ctrl-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? "⏸" : "▶"}
        </button>
        {audioError && <span className="ctrl-note">No narration for this scene yet</span>}
      </div>

      <button
        className={`nav-arrow nav-prev ${isFirst ? "nav-hidden" : ""}`}
        onClick={goPrev}
        aria-label="Previous chapter"
      >
        ‹
      </button>
      <button
        className={`nav-arrow nav-next ${isLast ? "nav-hidden" : ""}`}
        onClick={goNext}
        aria-label="Next chapter"
      >
        ›
      </button>

      {isLast && (
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
