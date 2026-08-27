/**
 * API Client Layer for SignBridge PK
 * Connects Next.js frontend to FastAPI backend (http://localhost:8000)
 * with robust client-side fallback.
 */

import { urduToPSLModel, UrduToPSLInferenceResult } from "./urdutopsl-model";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export interface BackendModelInfo {
  model_name: string;
  supported_datasets: string[];
  architecture: string;
  exported_format: string;
}

export interface BackendTokenResponse {
  id: string;
  urdu: string;
  gloss: string;
  english: string;
  category: string;
  duration_ms: number;
  confidence: number;
  description: string;
  avatar_pose?: import("./psl-dictionary").PSLSign["avatarPose"];
}

export interface BackendTranslateResponse {
  model_name: string;
  model_version: string;
  input_urdu: string;
  normalized_text: string;
  tokens: BackendTokenResponse[];
  gloss_sequence: string[];
  total_duration_ms: number;
  model_confidence: number;
}

export class SignBridgeAPI {
  private static instance: SignBridgeAPI;
  private isBackendOnline: boolean | null = null;
  private lastHealthCheck = 0;

  public static getInstance(): SignBridgeAPI {
    if (!SignBridgeAPI.instance) {
      SignBridgeAPI.instance = new SignBridgeAPI();
    }
    return SignBridgeAPI.instance;
  }

  /**
   * Check if the FastAPI backend is running and reachable
   */
  public async checkHealth(): Promise<boolean> {
    const now = Date.now();
    // Cache health status for 10 seconds
    if (this.isBackendOnline !== null && now - this.lastHealthCheck < 10000) {
      return this.isBackendOnline;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/`, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      this.isBackendOnline = res.ok;
    } catch {
      this.isBackendOnline = false;
    }
    this.lastHealthCheck = now;
    return this.isBackendOnline;
  }

  /**
   * Fetch backend model specifications
   */
  public async getModelInfo(): Promise<BackendModelInfo | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/model-info`, {
        method: "GET",
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("[SignBridgeAPI] Could not reach backend /api/model-info:", err);
    }
    return null;
  }

  /**
   * Translate Urdu text to PSL tokens using Backend when available,
   * falling back smoothly to the client-side urdutopsl engine.
   */
  public async translateUrduToPSL(text: string): Promise<UrduToPSLInferenceResult> {
    const isOnline = await this.checkHealth();
    if (isOnline) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/translate/urdu-to-psl`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            include_avatar_poses: true,
            speed_factor: 1.0,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const backendData: BackendTranslateResponse = await res.json();
          // Map backend response format to frontend UrduToPSLInferenceResult format
          return {
            modelName: "urdutopsl",
            modelVersion: "1.0.0-hybrid",
            inputUrdu: backendData.input_urdu,
            normalizedText: backendData.normalized_text,
            tokens: backendData.tokens.map((t) => ({
              id: t.id,
              urdu: t.urdu,
              gloss: t.gloss,
              english: t.english,
              category: t.category as "greeting" | "question" | "emergency" | "daily" | "alphabet" | "number",
              duration: t.duration_ms,
              description: t.description,
              avatarPose: t.avatar_pose || {
                leftArm: { shoulderAngle: 15, elbowAngle: 25, handShape: "open" },
                rightArm: { shoulderAngle: 15, elbowAngle: 25, handShape: "open" },
                headTilt: 0,
                expression: "neutral",
                motionType: "none",
              },
            })),
            glossSequence: backendData.gloss_sequence,
            totalDurationMs: backendData.total_duration_ms,
            wordCount: backendData.normalized_text.split(" ").filter(Boolean).length,
            signCount: backendData.tokens.length,
            modelConfidence: backendData.model_confidence,
            breakdown: backendData.tokens.map((t) => ({
              segment: t.urdu,
              type: t.category === "alphabet" ? "fingerspell" : "word_sign",
              gloss: t.gloss,
              confidence: t.confidence,
            })),
          };
        }
      } catch (err) {
        console.warn("[SignBridgeAPI] Backend translation failed, falling back to local engine:", err);
      }
    }

    // Fallback: Client-side urdutopsl model
    return await urduToPSLModel.infer(text);
  }
}

export const signBridgeAPI = SignBridgeAPI.getInstance();
