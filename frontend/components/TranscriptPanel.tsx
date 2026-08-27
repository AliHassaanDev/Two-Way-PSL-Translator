"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Copy, Check, RotateCcw, Trash2 } from "lucide-react";
import { PredictionToken } from "./PredictionPanel";

export interface TranscriptPanelProps {
  tokenBuffer: PredictionToken[];
  onUndoLast: () => void;
  onClearAll: () => void;
  onAddSpace?: () => void;
}

export default function TranscriptPanel({
  tokenBuffer,
  onUndoLast,
  onClearAll,
}: TranscriptPanelProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Construct accumulated sentences
  const fullUrduText = tokenBuffer
    .map((t) => t.urdu)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const fullEnglishText = tokenBuffer
    .map((t) => t.english)
    .join(" ")
    .trim();

  // Text to Speech for Translated Urdu Output (FR-09)
  const speakTranslation = () => {
    if (!fullUrduText || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(fullUrduText);
    utterance.lang = "ur-PK";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Copy Translation
  const copyTranslation = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel translation-panel">
      {/* Sentence Strip (Token Buffer) FR-06 */}
      <div className="sentence-strip-section">
        <div className="strip-header">
          <span>Recognized Phrase Buffer (جملہ کی پٹی):</span>
          <div className="strip-actions">
            {tokenBuffer.length > 0 && (
              <>
                <button className="small-text-btn" onClick={onUndoLast}>
                  Undo Last
                </button>
                <button className="small-text-btn danger" onClick={onClearAll}>
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        <div className="sentence-strip">
          {tokenBuffer.length === 0 ? (
            <span className="empty-strip-text">Start signing or click demo gestures to build a sentence...</span>
          ) : (
            tokenBuffer.map((tok, idx) => (
              <span key={`${tok.id}-${idx}`} className="sentence-word">
                <span className="word-urdu" dir="rtl">{tok.urdu}</span>
                <span className="word-gloss">{tok.gloss}</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Urdu Translation Output Box (FR-07) */}
      <div className="translation-box-wrapper">
        <div className={`translation-box ${fullUrduText ? "has-content" : ""}`}>
          {fullUrduText ? (
            <div className="output-text-urdu" dir="rtl">
              {fullUrduText}
            </div>
          ) : (
            <span className="placeholder-text">
              Sign in front of the camera to build your sentence...
            </span>
          )}
        </div>

        {/* English Subtitle Translation (FR-08) */}
        {fullEnglishText && (
          <div className="english-translation-sub">
            <span className="sub-label">English:</span> {fullEnglishText}
          </div>
        )}
      </div>

      {/* Translation Action Buttons */}
      <div className="translation-actions">
        <button
          className={`secondary-btn icon-text ${isSpeaking ? "active" : ""}`}
          onClick={speakTranslation}
          disabled={!fullUrduText}
          title="Listen to Urdu Speech (FR-09)"
        >
          {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{isSpeaking ? "Stop Audio" : "Listen (آواز سنیں)"}</span>
        </button>

        <button
          className="secondary-btn icon-text"
          onClick={() => copyTranslation(fullUrduText)}
          disabled={!fullUrduText}
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          <span>{copied ? "Copied!" : "Copy Urdu"}</span>
        </button>
      </div>
    </div>
  );
}
