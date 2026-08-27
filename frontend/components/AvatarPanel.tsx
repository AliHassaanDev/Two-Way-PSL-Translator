"use client";

import React, { useRef, useEffect } from "react";
import { Maximize2, Minimize2, ArrowUpRight } from "lucide-react";
import Avatar3D from "./Avatar3D";
import Controls from "./Controls";
import { PSLSign } from "../app/lib/psl-dictionary";

export interface AvatarPanelProps {
  signs: PSLSign[];
  currentSignIndex: number;
  setCurrentSignIndex: (idx: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fs: boolean) => void;
}

export default function AvatarPanel({
  signs,
  currentSignIndex,
  setCurrentSignIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  autoPlay,
  setAutoPlay,
  isFullscreen,
  setIsFullscreen,
}: AvatarPanelProps) {
  const activeChipRef = useRef<HTMLButtonElement>(null);
  const currentSign = signs[currentSignIndex] || (signs.length > 0 ? signs[0] : null);

  // Auto-scroll active sequence chip into view
  useEffect(() => {
    if (activeChipRef.current) {
      activeChipRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentSignIndex]);

  // Handle Fullscreen Scroll Lock
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }
    return () => document.body.classList.remove("body-no-scroll");
  }, [isFullscreen]);

  return (
    <div className={`panel avatar-panel ${isFullscreen ? "fullscreen-stage" : ""}`}>
      {/* Panel Title & Status Header */}
      <div className="panel-title-row">
        <div className="avatar-header-info">
          <span className="panel-title">PSL 3D Signer Output (FR-13)</span>
          {currentSign && (
            <span className="active-sign-badge">
              Sign {currentSignIndex + 1}/{signs.length}: <strong>{currentSign.urdu}</strong> ({currentSign.gloss})
            </span>
          )}
        </div>
        <button
          className="icon-circle-btn"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* 3D WebGL Avatar Stage */}
      <div className="avatar-stage">
        <Avatar3D sign={currentSign} isPlaying={isPlaying} speed={speed} />

        {/* In-Stage Overlay Controls (FR-14) */}
        <Controls
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          onReplay={() => {
            setCurrentSignIndex(0);
            setIsPlaying(true);
          }}
          hasTokens={signs.length > 0}
        />

        {/* Gesture description banner at the bottom of stage */}
        {currentSign && (
          <div className="sign-description-banner">
            <span className="desc-text">{currentSign.description}</span>
          </div>
        )}
      </div>

      {/* Timeline & Sign Sequence Visualizer */}
      {signs.length > 0 && (
        <div className="sign-timeline-bar">
          <div className="timeline-labels">
            <div className="timeline-title-group">
              <span className="timeline-main-title">Sign Sequence Progression</span>
              <span className="timeline-counter-badge">
                {currentSignIndex + 1} of {signs.length} signs
              </span>
            </div>
            <span className="timeline-percent-badge">
              {Math.round(((currentSignIndex + 1) / signs.length) * 100)}%
            </span>
          </div>

          <div className="timeline-track">
            <div
              className="timeline-progress"
              style={{ width: `${((currentSignIndex + 1) / signs.length) * 100}%` }}
            />
          </div>

          <div className="sequence-chips-row">
            {signs.map((s, idx) => (
              <button
                key={`${s.id}-${idx}`}
                ref={idx === currentSignIndex ? activeChipRef : null}
                className={`sequence-chip ${
                  idx === currentSignIndex
                    ? "active"
                    : idx < currentSignIndex
                    ? "completed"
                    : ""
                }`}
                onClick={() => {
                  setCurrentSignIndex(idx);
                  setIsPlaying(true);
                }}
                title={`Sign ${idx + 1}: ${s.urdu} (${s.gloss})`}
              >
                <span className="seq-step-num">#{idx + 1}</span>
                <span className="seq-urdu" dir="rtl">{s.urdu}</span>
                <span className="seq-gloss">{s.gloss.replace(/^SPELL_/, "Letter ")}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Controls & Toggles */}
      <div className="avatar-footer">
        <div className="toggle-group">
          <button
            className={`switch ${autoPlay ? "on" : ""}`}
            onClick={() => setAutoPlay(!autoPlay)}
            aria-label="Toggle Auto Play"
          >
            <span />
          </button>
          <span className="toggle-label">Auto-Play on Translation</span>
        </div>

        <button className="fullscreen-btn" onClick={() => setIsFullscreen(!isFullscreen)}>
          {isFullscreen ? "Exit Fullscreen" : "Expanded View"}{" "}
          {isFullscreen ? <Minimize2 size={13} /> : <ArrowUpRight size={13} />}
        </button>
      </div>
    </div>
  );
}
