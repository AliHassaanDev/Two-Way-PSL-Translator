"use client";

import React, { useState } from "react";
import { Sparkles, Play, Hand, BookOpen, Layers } from "lucide-react";

export interface DemoSample {
  id: string;
  urdu: string;
  english: string;
  gloss: string;
  confidence: number;
  type: "word" | "alphabet";
  description: string;
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: "salam",
    urdu: "السلام علیکم",
    english: "Peace be upon you / Hello",
    gloss: "HELLO",
    confidence: 0.97,
    type: "word",
    description: "Salute gesture from forehead sweeping gently outward.",
  },
  {
    id: "aap_kaisay",
    urdu: "آپ کیسے ہیں؟",
    english: "How are you?",
    gloss: "HOW_ARE_YOU",
    confidence: 0.94,
    type: "word",
    description: "Point forward followed by open questioning hands.",
  },
  {
    id: "shukriya",
    urdu: "شکریہ",
    english: "Thank you",
    gloss: "THANK_YOU",
    confidence: 0.96,
    type: "word",
    description: "Touch fingertips to chin and bring hand forward.",
  },
  {
    id: "madad",
    urdu: "مدد",
    english: "Help",
    gloss: "HELP",
    confidence: 0.95,
    type: "word",
    description: "Closed fist resting on flat supporting palm, lifted upward.",
  },
  {
    id: "paani",
    urdu: "پانی",
    english: "Water",
    gloss: "WATER",
    confidence: 0.93,
    type: "word",
    description: "Three fingers forming 'W' tapped gently near corner of mouth.",
  },
  {
    id: "doctor",
    urdu: "ڈاکٹر",
    english: "Doctor",
    gloss: "DOCTOR",
    confidence: 0.92,
    type: "word",
    description: "Two fingers pressed to wrist checking radial pulse.",
  },
  {
    id: "pakistan",
    urdu: "پاکستان",
    english: "Pakistan",
    gloss: "PAKISTAN",
    confidence: 0.98,
    type: "word",
    description: "Crescent shape curved in air with right index and thumb.",
  },
  {
    id: "naam",
    urdu: "میرا نام",
    english: "My name is",
    gloss: "MY_NAME",
    confidence: 0.95,
    type: "word",
    description: "Flat right palm pressed gently against chest.",
  },
  {
    id: "alif",
    urdu: "ا",
    english: "Letter Alif",
    gloss: "ALIF",
    confidence: 0.91,
    type: "alphabet",
    description: "Index finger pointed vertically straight upward.",
  },
  {
    id: "bay",
    urdu: "ب",
    english: "Letter Bay",
    gloss: "BAY",
    confidence: 0.90,
    type: "alphabet",
    description: "Horizontal cupped palm with index pointing downward for one dot.",
  },
  {
    id: "pay",
    urdu: "پ",
    english: "Letter Pay",
    gloss: "PAY",
    confidence: 0.89,
    type: "alphabet",
    description: "Horizontal cupped palm with three fingers indicating three dots.",
  },
  {
    id: "meem",
    urdu: "م",
    english: "Letter Meem",
    gloss: "MEEM",
    confidence: 0.93,
    type: "alphabet",
    description: "Fist closed with thumb wrapped inward forming circular loop.",
  },
  {
    id: "noon",
    urdu: "ن",
    english: "Letter Noon",
    gloss: "NOON",
    confidence: 0.92,
    type: "alphabet",
    description: "Cupped palm upward with thumb touching center.",
  },
];

export default function DemoSelector({
  onSelectSample,
}: {
  onSelectSample: (sample: DemoSample) => void;
}) {
  const [filter, setFilter] = useState<"all" | "words" | "alphabet">("all");

  const filteredSamples = DEMO_SAMPLES.filter((s) => {
    if (filter === "words") return s.type === "word";
    if (filter === "alphabet") return s.type === "alphabet";
    return true;
  });

  return (
    <div className="demo-mode-container" style={{ padding: "16px", borderRadius: "12px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "14px", color: "#67e8f9", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={15} /> Demo Gesture Testbed (FR-17)
          </h4>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Click any pre-recorded PSL sign to inject it into live recognition & sentence builder
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              border: "none",
              cursor: "pointer",
              background: filter === "all" ? "rgba(29, 184, 189, 0.25)" : "rgba(255, 255, 255, 0.05)",
              color: filter === "all" ? "#67e8f9" : "var(--text-muted)",
            }}
          >
            All Signs
          </button>
          <button
            onClick={() => setFilter("words")}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              border: "none",
              cursor: "pointer",
              background: filter === "words" ? "rgba(29, 184, 189, 0.25)" : "rgba(255, 255, 255, 0.05)",
              color: filter === "words" ? "#67e8f9" : "var(--text-muted)",
            }}
          >
            Words ({DEMO_SAMPLES.filter((s) => s.type === "word").length})
          </button>
          <button
            onClick={() => setFilter("alphabet")}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              border: "none",
              cursor: "pointer",
              background: filter === "alphabet" ? "rgba(29, 184, 189, 0.25)" : "rgba(255, 255, 255, 0.05)",
              color: filter === "alphabet" ? "#67e8f9" : "var(--text-muted)",
            }}
          >
            Fingerspelling ({DEMO_SAMPLES.filter((s) => s.type === "alphabet").length})
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "10px",
          maxHeight: "320px",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        {filteredSamples.map((sample) => (
          <div
            key={sample.id}
            onClick={() => onSelectSample(sample)}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(29, 184, 189, 0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: sample.type === "word" ? "rgba(29, 184, 189, 0.15)" : "rgba(139, 92, 246, 0.15)",
                  color: sample.type === "word" ? "#67e8f9" : "#c4b5fd",
                }}
              >
                {sample.type === "word" ? "Word Sign" : "Urdu Letter"}
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{Math.round(sample.confidence * 100)}%</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong dir="rtl" style={{ fontSize: "16px", color: "#f8fafc" }}>{sample.urdu}</strong>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>{sample.gloss}</span>
            </div>

            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {sample.english}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "10px", color: "#67e8f9" }}>
              <Play size={10} /> Click to Test Gesture
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
