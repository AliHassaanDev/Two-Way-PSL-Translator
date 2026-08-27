"use client";

import React from "react";
import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface PredictionToken {
  id: string;
  urdu: string;
  english: string;
  gloss: string;
  confidence: number;
  type: "word" | "alphabet";
  source?: string;
}

export default function PredictionPanel({
  currentDetection,
}: {
  currentDetection: PredictionToken | null;
}) {
  const isConfident = currentDetection && currentDetection.confidence >= 0.75;
  const isUncertain = currentDetection && currentDetection.confidence < 0.75;

  return (
    <div className="live-prediction-card">
      <div className="prediction-header">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} />
          <span>Live Detection (براہ راست اشارہ)</span>
        </div>
        {currentDetection && (
          <span
            style={{
              fontSize: "10px",
              padding: "2px 8px",
              borderRadius: "10px",
              background: currentDetection.type === "word" ? "rgba(29, 184, 189, 0.15)" : "rgba(139, 92, 246, 0.15)",
              color: currentDetection.type === "word" ? "#67e8f9" : "#c4b5fd",
            }}
          >
            {currentDetection.type === "word" ? "PSL Word" : "Fingerspelling"}
          </span>
        )}
      </div>

      {currentDetection ? (
        <div className="prediction-content">
          <div className="prediction-main">
            <strong dir="rtl" className="pred-urdu">{currentDetection.urdu}</strong>
            <span className="pred-gloss">{currentDetection.gloss}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              {currentDetection.english}
            </span>
          </div>

          <div className="prediction-confidence">
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {isConfident ? (
                <CheckCircle2 size={13} color="#10b981" />
              ) : (
                <AlertTriangle size={13} color="#f59e0b" />
              )}
              <span className="conf-value">{Math.round(currentDetection.confidence * 100)}%</span>
            </div>
            <span className="conf-label">
              {isConfident ? "High Confidence" : "Uncertain Gesture (FR-15)"}
            </span>
          </div>
        </div>
      ) : (
        <div className="prediction-empty">
          <span style={{ opacity: 0.7 }}>Waiting for gesture sign... (اشارے کا انتظار ہے)</span>
        </div>
      )}
    </div>
  );
}
