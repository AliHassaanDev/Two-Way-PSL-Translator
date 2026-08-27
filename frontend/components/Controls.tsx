"use client";

import React from "react";
import { Play, Pause, RotateCcw, Clock3 } from "lucide-react";

export interface ControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onReplay: () => void;
  hasTokens: boolean;
}

export default function Controls({
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  onReplay,
  hasTokens,
}: ControlsProps) {
  // Cycle animation speed between 0.6x, 1.0x, and 1.4x
  const cycleSpeed = () => {
    if (speed === 1) setSpeed(0.6);
    else if (speed === 0.6) setSpeed(1.4);
    else setSpeed(1);
  };

  return (
    <div className="avatar-controls">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`control-btn ${isPlaying ? "playing" : ""}`}
        title={isPlaying ? "Pause Animation (FR-14)" : "Play Sign Animation (FR-14)"}
        disabled={!hasTokens}
      >
        {isPlaying ? <Pause size={17} /> : <Play size={17} />}
        <span>{isPlaying ? "Pause" : "Play"}</span>
      </button>

      <button
        onClick={onReplay}
        className="control-btn"
        title="Replay Sequence from Beginning (FR-14)"
        disabled={!hasTokens}
      >
        <RotateCcw size={17} />
        <span>Replay</span>
      </button>

      <button
        onClick={cycleSpeed}
        className="control-btn speed-btn"
        title="Adjust Animation Playback Speed"
      >
        <Clock3 size={17} />
        <span>{speed === 1 ? "1.0x" : speed < 1 ? "0.6x Slow" : "1.4x Fast"}</span>
      </button>
    </div>
  );
}
