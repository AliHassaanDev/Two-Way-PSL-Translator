/**
 * MediaPipe Landmark Extraction & Skeleton Visualization Engine
 * Fulfills Blueprint Section 9.1 & Functional Requirement FR-02
 */

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface HandLandmarks {
  landmarks: LandmarkPoint[];
  handedness?: "Left" | "Right";
  score?: number;
}

// 21 standard hand landmark connections
export const HAND_CONNECTIONS: [number, number][] = [
  // Palm Base
  [0, 1], [0, 5], [5, 9], [9, 13], [13, 17], [0, 17],
  // Thumb
  [1, 2], [2, 3], [3, 4],
  // Index Finger
  [5, 6], [6, 7], [7, 8],
  // Middle Finger
  [9, 10], [10, 11], [11, 12],
  // Ring Finger
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [17, 18], [18, 19], [19, 20],
];

// Upper-body pose connections (Shoulders -> Elbows -> Wrists)
export const UPPER_BODY_CONNECTIONS: [number, number][] = [
  [11, 12], // Left shoulder to Right shoulder
  [11, 13], // Left shoulder to Left elbow
  [13, 15], // Left elbow to Left wrist
  [12, 14], // Right shoulder to Right elbow
  [14, 16], // Right elbow to Right wrist
];

/**
 * Renders complete 21-point hand skeleton landmarks with modern styling
 */
export function drawHandSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: LandmarkPoint[],
  width: number,
  height: number,
  options?: {
    boneColor?: string;
    jointColor?: string;
    lineWidth?: number;
    showBoundingBox?: boolean;
  }
) {
  if (!landmarks || landmarks.length < 21) return;

  const boneColor = options?.boneColor || "rgba(29, 184, 189, 0.85)";
  const jointColor = options?.jointColor || "#ffffff";
  const lineWidth = options?.lineWidth || 2.5;

  ctx.save();

  // 1. Draw Bones / Connections
  ctx.strokeStyle = boneColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    if (!start || !end) continue;

    ctx.beginPath();
    ctx.moveTo(start.x * width, start.y * height);
    ctx.lineTo(end.x * width, end.y * height);
    ctx.stroke();
  }

  // 2. Draw Landmark Joints
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  landmarks.forEach((pt, idx) => {
    const px = pt.x * width;
    const py = pt.y * height;

    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);

    const isRoot = idx === 0;
    const isFingertip = [4, 8, 12, 16, 20].includes(idx);

    ctx.beginPath();
    ctx.arc(px, py, isRoot ? 5.5 : isFingertip ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isRoot ? "#1db8bd" : isFingertip ? "#67e8f9" : jointColor;
    ctx.fill();
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // 3. Draw Bounding Box & Articulation Tag
  if (options?.showBoundingBox !== false && minX < maxX) {
    const pad = 16;
    ctx.strokeStyle = "rgba(139, 92, 246, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(minX - pad, minY - pad, (maxX - minX) + pad * 2, (maxY - minY) + pad * 2);
    ctx.setLineDash([]);
  }

  ctx.restore();
}

/**
 * Generates an active 21-point MediaPipe hand landmark sequence for simulation or fallback
 */
export function generateSyntheticHandLandmarks(timeMs: number): LandmarkPoint[] {
  const t = timeMs / 500;
  const cx = 0.52 + Math.sin(t) * 0.04;
  const cy = 0.52 + Math.cos(t) * 0.03;

  // Palm base
  const wrist: LandmarkPoint = { x: cx, y: cy + 0.16, z: 0 };
  const thumbBase: LandmarkPoint = { x: cx - 0.06, y: cy + 0.08, z: 0 };

  const landmarks: LandmarkPoint[] = [
    wrist, // 0: Wrist
    thumbBase, // 1: Thumb CMC
    { x: cx - 0.09, y: cy + 0.03, z: 0 }, // 2: Thumb MCP
    { x: cx - 0.11, y: cy - 0.02, z: 0 }, // 3: Thumb IP
    { x: cx - 0.12, y: cy - 0.06 + Math.sin(t * 1.5) * 0.02, z: 0 }, // 4: Thumb TIP
    // Index
    { x: cx - 0.04, y: cy + 0.02, z: 0 }, // 5: Index MCP
    { x: cx - 0.05, y: cy - 0.06, z: 0 }, // 6: Index PIP
    { x: cx - 0.05, y: cy - 0.11, z: 0 }, // 7: Index DIP
    { x: cx - 0.05, y: cy - 0.16 + Math.sin(t * 1.2) * 0.015, z: 0 }, // 8: Index TIP
    // Middle
    { x: cx, y: cy + 0.01, z: 0 }, // 9: Middle MCP
    { x: cx, y: cy - 0.08, z: 0 }, // 10: Middle PIP
    { x: cx, y: cy - 0.14, z: 0 }, // 11: Middle DIP
    { x: cx, y: cy - 0.19 + Math.sin(t * 1.2) * 0.01, z: 0 }, // 12: Middle TIP
    // Ring
    { x: cx + 0.04, y: cy + 0.02, z: 0 }, // 13: Ring MCP
    { x: cx + 0.05, y: cy - 0.06, z: 0 }, // 14: Ring PIP
    { x: cx + 0.05, y: cy - 0.11, z: 0 }, // 15: Ring DIP
    { x: cx + 0.05, y: cy - 0.15 + Math.sin(t * 1.3) * 0.01, z: 0 }, // 16: Ring TIP
    // Pinky
    { x: cx + 0.08, y: cy + 0.04, z: 0 }, // 17: Pinky MCP
    { x: cx + 0.09, y: cy - 0.02, z: 0 }, // 18: Pinky PIP
    { x: cx + 0.10, y: cy - 0.07, z: 0 }, // 19: Pinky DIP
    { x: cx + 0.10, y: cy - 0.11 + Math.sin(t * 1.4) * 0.01, z: 0 }, // 20: Pinky TIP
  ];

  return landmarks;
}
